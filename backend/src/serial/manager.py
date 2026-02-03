import asyncio
import json

from serial import Serial, SerialException

class SerialManager:
  def __init__ (self):
    self.port = None
    self.baudrate = None
    self.timeout = None
    self.serial_connection = None
    self.is_connected = False

  def set_ports (self, port: str, baudrate: int, timeout: float = 1.0):
    """Set serial port and baudrate"""
    self.port = port
    self.baudrate = baudrate
    self.timeout = timeout

  def connect (self):
    """Connect to serial"""
    try:
      self.serial_connection = Serial(
        port=self.port,
        baudrate=self.baudrate,
        timeout=self.timeout
      )
      self.is_connected = True
      print(f"CONNECTED TO SERIAL PORT: {self.port} AT {self.baudrate} BAUDRATE")
      return True
    except Exception as e:
      self.is_connected = False
      print(f"FAILED TO CONNECT TO SERIAL PORT: {self.port}. ERROR: {e}")
      return False
  
  def disconnect (self):
    """Disconnect from serial"""
    if self.serial_connection and self.serial_connection.is_open:
      self.serial_connection.close()
      self.is_connected = False
      print(f"DISCONNECTED FROM SERIAL PORT: {self.port}")
  
  async def read_line (self):
    """Read line from serial"""
    if not self.serial_connection or not self.serial_connection.is_open:
      return None
  
    try:
      loop = asyncio.get_event_loop()
      line = await loop.run_in_executor(None, self.serial_connection.readline)

      if line:
        line_str = line.decode('utf-8').strip()
        return self.parse_telemetry(line_str)
      return None
    except SerialException as e:
      print(f"SERIAL EXCEPTION ON PORT: {self.port}. ERROR: {e}")
      self.is_connected = False
      return None
    except Exception as e:
      print(f"ERROR READING FROM SERIAL PORT: {self.port}. ERROR: {e}")
      return None

  def parse_telemetry (self, line: str):
    """Parse telemetry data from line"""
    try:
      data = json.loads(line)
      return data
    except json.JSONDecodeError:
      print(f"INVALID TELEMETRY DATA: {line}")
      return None
