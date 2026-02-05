import queue
import threading
import csv
import time

def get_headers ():
  return [
    "altitude",
    "gpsAltitude",
    "flightStatus",
    "accelerationX",
    "accelerationY",
    "accelerationZ",
    "totalAcceleration",
    "gyroscopeX",
    "gyroscopeY",
    "gyroscopeZ",
    "roll",
    "pitch",
    "yaw",
    "gpsLatitude",
    "gpsLongitude",
    "payloadAltitude",
    "payloadLatitude",
    "payloadLongitude",
    "batteryVoltage",
    "temperature",
    "timestamp",
    "ground_timestamp"
  ]

class CSVManager:
  # TODO: Implement buffer size and flush interval configuration
  def __init__ (self, buffer_size: int = 50, flush_interval: float = 5.0):
    self.buffer_size = buffer_size
    self.flush_interval = flush_interval
    self.queue = queue.Queue()
    self.running = threading.Event()
    self.worker_thread = None

    self.current_file = None
    self.csv_writer = None
    self.buffer = []
    self.last_flush_time = time.time()

    self.file_path = None
    self.headers = None

  def start_recording (self, file_path: str):
    """Start CSV recording"""
    if self.running.is_set():
      return

    self.file_path = file_path
    self.headers = get_headers()

    self.running.set()
    self.last_flush_time = time.time()
    self.worker_thread = threading.Thread(target=self._worker_loop, daemon=True)
    self.worker_thread.start()

  def stop_recording (self):
    """Stop CSV recording"""
    if not self.running.is_set():
      return

    self.running.clear()
    self.queue.put(None)
    if self.worker_thread is not None:
      self.worker_thread.join()

    if self.current_file is not None:
      self.current_file.close()
      self.current_file = None

  def add_packet (self, data: dict):
    """Add telemetry packet to CSV buffer"""
    if self.running.is_set():
      self.queue.put(data)

  def _flush_buffer(self):
    """Flush buffer to CSV file"""
    if not self.buffer or self.current_file is None:
      return

    try:
      self.csv_writer.writerows(self.buffer)
      self.current_file.flush()
    except ValueError as e:
      print(f"ERROR FLUSHING CSV BUFFER: {e}")
    except Exception as e:
      print(f"ERROR WRITING CSV FILE: {e}")

    self.buffer.clear()
    self.last_flush_time = time.time()

  def _worker_loop (self):
    """Worker thread loop to write CSV data"""
    try:
      self.current_file = open(self.file_path, mode='w', newline='', encoding='utf-8')
      self.csv_writer = csv.DictWriter(self.current_file, fieldnames=self.headers, extrasaction='ignore')
      self.csv_writer.writeheader()
    except Exception as e:
      print(f"ERROR OPENING CSV FILE: {e}")
      self.running.clear()
      return

    while self.running.is_set() or not self.queue.empty():
      try:
        time_since_flush = time.time() - self.last_flush_time
        timeout = max(0.0, self.flush_interval - time_since_flush)

        packet = self.queue.get(timeout=timeout)

        if packet is None:
          break

        self.buffer.append(packet)

        if len(self.buffer) >= self.buffer_size:
          self._flush_buffer()
      except queue.Empty:
        self._flush_buffer()
      except Exception as e:
        print(f"ERROR IN CSV WORKER LOOP: {e}")

    self._flush_buffer()
