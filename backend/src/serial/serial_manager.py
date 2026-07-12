import asyncio
import time

from threading import Thread, Event
from serial import Serial, SerialException
from asyncio import Queue, QueueFull

from ..state.state_manager import global_state
from ..csv.csv_manager import global_csv
from ..utils.logger import logger
from ..utils.parser import CURRENT_LINE_LENGTH, TARGET_LINE_LENGTH

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

  def _read_loop (self) -> None:
    self._running = True
    buffer = b""
    while not self._stop_event.is_set():
      try:
        bytes_available = self.serial_connection.in_waiting
        if bytes_available > 0:
          buffer += self.serial_connection.read(bytes_available)

          while b"\r\n" in buffer:
            line_end = buffer.index(b"\r\n")
            line = buffer[:line_end]
            buffer = buffer[line_end + 2:]

            hex_line = line.decode("ascii", errors="ignore").strip()

            if len(hex_line) not in (CURRENT_LINE_LENGTH, TARGET_LINE_LENGTH):
              logger(f"BAD LINE LENGTH: {len(hex_line)}, EXPECTED {CURRENT_LINE_LENGTH} OR {TARGET_LINE_LENGTH}", "WARNING")
              continue

            if self.async_queue and self._loop:
              try:
                self._loop.call_soon_threadsafe(self.async_queue.put_nowait, hex_line)
              except QueueFull:
                logger("ASYNC QUEUE FULL, DROPPING DATA", "WARNING")

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
