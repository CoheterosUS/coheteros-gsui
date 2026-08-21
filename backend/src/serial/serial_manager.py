import asyncio
import time

from threading import Thread, Event
from serial import Serial, SerialException
from asyncio import Queue, QueueFull, QueueEmpty

from ..state.state_manager import global_state
from ..csv.csv_manager import global_csv
from ..utils.logger import logger
from ..utils.parser import FLIGHT_DATA_SIZE, SYNC_BYTES, SYNC_END, build_command_frame

MAX_BUFFER_SIZE = FLIGHT_DATA_SIZE * 32

class SerialManager:
  def __init__ (self, buffer_size: int = 100):
    self.serial_connection: Serial | None = None
    self.port: str | None = None
    self.baudrate: int | None = None

    self.async_queue = Queue(maxsize=buffer_size)
    self._loop: asyncio.AbstractEventLoop | None = None

    self._read_thread: Thread | None = None
    self._stop_event: Event = Event()
    self._running: bool = False

  def connect (self, port: str, baudrate: int) -> bool:
    try:
      self.port = port
      self.baudrate = baudrate
      self.serial_connection = Serial(
        port=port,
        baudrate=baudrate,
        timeout=0.1,
        write_timeout=0.1
      )

      logger(f"CONNECTED TO SERIAL PORT: {port} AT {baudrate} BAUDRATE")
      return True
    except Exception as e:
      logger(f"FAILED TO CONNECT TO SERIAL PORT: {e}", "ERROR")
      return False

  def send_command (self, command: str) -> bool:
    if not self.serial_connection or not self.serial_connection.is_open:
      logger(f"CANNOT SEND {command}: SERIAL CONNECTION NOT ESTABLISHED", "ERROR")
      return False

    frame = build_command_frame(command)
    if frame is None:
      return False

    try:
      self.serial_connection.write(frame)
      self.serial_connection.flush()
    except Exception as e:
      logger(f"FAILED TO SEND {command}: {e}", "ERROR")
      return False

    logger(f"SENT COMMAND {command}: {frame.hex()}")
    return True

  def start_reading (self) -> None:
    if self._running:
      logger("SERIAL READING ALREADY RUNNING", "WARNING")
      return

    if not self.serial_connection or not self.serial_connection.is_open:
      logger("SERIAL CONNECTION NOT ESTABLISHED", "ERROR")
      return

    self._stop_event.clear()
    self._loop = asyncio.get_event_loop()

    self._read_thread = Thread(
      target=self._read_loop,
      daemon=True,
      name="SerialReadThread"
    )
    self._read_thread.start()
    logger("STARTED SERIAL READING THREAD")

  def _enqueue (self, hex_line: str) -> None:
    # runs on the event loop thread, so put_nowait raises here and not in the reader
    try:
      self.async_queue.put_nowait(hex_line)
    except QueueFull:
      try:
        self.async_queue.get_nowait()
      except QueueEmpty:
        pass
      else:
        logger("ASYNC QUEUE FULL, DROPPING OLDEST PACKET", "WARNING")
      self.async_queue.put_nowait(hex_line)

  def _read_loop (self) -> None:
    self._running = True
    buffer = b""
    while not self._stop_event.is_set():
      try:
        bytes_available = self.serial_connection.in_waiting
        if bytes_available > 0:
          buffer += self.serial_connection.read(bytes_available)

          while True:
            sync_index = buffer.find(SYNC_BYTES)
            if sync_index == -1:
              # keep a trailing byte in case the sync word is split across reads
              buffer = buffer[-1:] if len(buffer) < MAX_BUFFER_SIZE else b""
              break

            if sync_index > 0:
              logger(f"DISCARDED {sync_index} BYTES BEFORE SYNC", "WARNING")
              buffer = buffer[sync_index:]

            if len(buffer) < FLIGHT_DATA_SIZE:
              break

            frame = buffer[:FLIGHT_DATA_SIZE]

            # sync word can occur inside a payload; footer confirms the frame
            if frame[-1] != SYNC_END:
              logger("SYNC END MISMATCH, RESYNCING", "WARNING")
              buffer = buffer[len(SYNC_BYTES):]
              continue

            buffer = buffer[FLIGHT_DATA_SIZE:]

            hex_line = frame.hex()

            if self.async_queue and self._loop:
              try:
                self._loop.call_soon_threadsafe(self._enqueue, hex_line)
              except RuntimeError:
                logger("EVENT LOOP CLOSED, DROPPING DATA", "WARNING")

            if global_state.is_recording_csv:
              global_csv.push(hex_line)
        else:
          time.sleep(0.01)
      except SerialException as e:
        logger(f"SERIAL READ ERROR: {e}", "ERROR")
        time.sleep(0.1)
      except Exception as e:
        logger(f"UNEXPECTED SERIAL ERROR: {e}", "ERROR")

    self._running = False
    logger("SERIAL READING THREAD STOPPED")

  def stop_reading (self) -> None:
    if not self._running:
      logger("SERIAL READING NOT RUNNING", "WARNING")
      return

    logger("STOPPING SERIAL READING THREAD")
    self._stop_event.set()
    if self._read_thread:
      self._read_thread.join(timeout=1.0)

    logger("SERIAL READING THREAD STOPPED")

  def disconnect (self) -> None:
    self.stop_reading()

    while not self.async_queue.empty():
      self.async_queue.get_nowait()

    if self.serial_connection and self.serial_connection.is_open:
      self.serial_connection.close()
      logger(f"DISCONNECTED FROM SERIAL PORT: {self.port}")

      self.serial_connection = None
      self.port = None
      self.baudrate = None
    else:
      logger("SERIAL CONNECTION NOT ESTABLISHED OR ALREADY CLOSED", "WARNING")

global_serial = SerialManager()
