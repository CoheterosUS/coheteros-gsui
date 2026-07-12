import time
import csv

from queue import Queue, Empty
from threading import Thread, Event
from datetime import datetime

from ..utils.logger import logger
from ..utils.parser import parse_hex_line

CSV_HEADERS = [
  "ground_timestamp", "timestamp", "flightStatus",
  "altitude", "accelerationX", "accelerationY", "accelerationZ", "totalAcceleration",
  "gyroscopeX", "gyroscopeY", "gyroscopeZ",
  "magnetometerX", "magnetometerY", "magnetometerZ",
  "gpsLatitude", "gpsLongitude",
  "temperature", "pressure", "velocityZ", "batteryVoltage",
]

class CSVManager:
  def __init__ (self, flush_size: int = 50, flush_timeout: float = 2.0):
    self.flush_size = flush_size
    self.flush_timeout = flush_timeout

    self._queue: Queue = Queue()
    self._stop_event: Event = Event()
    self._writer_thread: Thread | None = None
    self._running: bool = False
    self._filepath: str | None = None

  def start (self, filepath: str | None = None) -> None:
    if self._running:
      logger("CSV IS ALREADY RECORDING", "WARNING")
      return

    self._filepath = filepath or f"recording_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    self._stop_event.clear()

    self._writer_thread = Thread(
      target=self._writer_loop,
      daemon=True,
      name="CSVWriteThread"
    )

    self._writer_thread.start()
    self._running = True
    logger(f"CSV RECORDING STARTED: {self._filepath}")

  def stop (self) -> None:
    if not self._running:
      logger("CSV IS NOT RECORDING", "WARNING")
      return

    logger("STOPPING CSV RECORDING")
    self._stop_event.set()

    if self._writer_thread:
      self._writer_thread.join()

    self._running = False
    logger("CSV RECORDING STOPPED")

  def push (self, data: str) -> None:
    if self._running:
      self._queue.put_nowait(data)

  def _writer_loop (self) -> None:
    buffer: list[list] = []
    last_flush = time.monotonic()

    with open(self._filepath, "a", newline="") as f:
      writer = csv.writer(f)
      writer.writerow(CSV_HEADERS)

      while not self._stop_event.is_set() or not self._queue.empty():
        try:
          data = self._queue.get(timeout=0.05)
          self._parse_into_buffer(data, buffer)
        except Empty:
          pass

        now = time.monotonic()
        time_due = buffer and (now - last_flush) >= self.flush_timeout
        size_due = len(buffer) >= self.flush_size

        if time_due or size_due:
          writer.writerows(buffer)
          f.flush()
          buffer.clear()
          last_flush = now

      if buffer:
        writer.writerows(buffer)
        f.flush()

  def _parse_into_buffer (self, data: str, buffer: list) -> None:
    parsed = parse_hex_line(data)
    if parsed is None:
      return
    row = [parsed.get(h, 0) for h in CSV_HEADERS]
    buffer.append(row)

global_csv = CSVManager()
