import asyncio
import json
import datetime
import time
import os

from serial import Serial, SerialException

from ..managers.csv import CSVManager

class SerialManager:
  def __init__ (self):
    self.serial_connection = None
    self.is_connected = False
    self.csv_manager = None

  def connect (self, port: str, baudrate: int, timeout: float = 1.0):
    """Connect to serial"""
    loop = asyncio.get_event_loop()
    return loop.run_in_executor(None, self._connect_sync, port, baudrate, timeout)

  def _connect_sync (self, port: str, baudrate: int, timeout: float):
    try:
      self.serial_connection = Serial(
        port=port,
        baudrate=baudrate,
        timeout=timeout
      )

      self.serial_connection.reset_input_buffer()

      self.is_connected = True
      print(f"CONNECTED TO SERIAL PORT: {port} AT {baudrate} BAUDRATE")
      return True
    except Exception as e:
      self.is_connected = False
      print(f"FAILED TO CONNECT TO SERIAL PORT: {port}. ERROR: {e}")
      return False

  def disconnect (self):
    """Disconnect from serial"""
    if self.serial_connection and self.serial_connection.is_open:
      self.serial_connection.close()
      self.is_connected = False
      print(f"DISCONNECTED FROM SERIAL PORT: {self.serial_connection.port}")

  async def read_line (self):
    """Read line from serial"""
    if not self.serial_connection or not self.serial_connection.is_open:
      return None

    try:
      loop = asyncio.get_event_loop()
      line = await loop.run_in_executor(None, self.serial_connection.readline)

      if line:
        return line.decode('utf-8').strip()
      return None
    except SerialException as e:
      print(f"SERIAL EXCEPTION ON PORT: {self.serial_connection.port}. ERROR: {e}")
      self.is_connected = False
      return None
    except Exception as e:
      print(f"ERROR READING FROM SERIAL PORT: {self.serial_connection.port}. ERROR: {e}")
      return None

  def parse_telemetry (self, line: str):
    """Parse telemetry data from line"""
    try:
      data = json.loads(line)
      data['ground_timestamp'] = time.time()
      return data
    except json.JSONDecodeError:
      print(f"INVALID TELEMETRY DATA: {line}")
      return None

  def write_csv (self, data: dict):
    """Write telemetry data to CSV"""
    if self.csv_manager is not None:
      self.csv_manager.add_packet(data)

  def start_csv_record (self):
    """Start CSV record"""
    if self.csv_manager is None:
      self.csv_manager = CSVManager()

    self.csv_manager.start_recording(f"telemetry_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.csv")

  def stop_csv_record (self):
    """Stop CSV record"""
    if self.csv_manager is not None:
      self.csv_manager.stop_recording()
      self.csv_manager = None
