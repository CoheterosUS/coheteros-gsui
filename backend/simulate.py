import time
import struct
import random
import math

from serial import Serial, SerialException

from os import getenv
from dotenv import load_dotenv

load_dotenv()

COM_PORT = getenv("TESTING_COM_PORT", "COM2")
COM_BAUDRATE = int(getenv("TESTING_COM_BAUDRATE", 115200))
PACKET_FREQUENCY = int(getenv("PACKET_FREQUENCY", 10))

SENSOR_DATA_FMT = "<HI11f2i2f"
STATE_EVENT_FMT = "<I66sI"

START_TIME = time.time()

def build_hex_line() -> bytes:
  elapsed = time.time() - START_TIME
  timestamp_ms = int(elapsed * 1000)

  state_byte = int((elapsed // 10) % 7)

  accel_x = random.uniform(-2, 2)
  accel_y = random.uniform(-2, 2)
  accel_z = 9.8 + random.uniform(-0.5, 0.5)

  gyro_x = random.uniform(-30, 30)
  gyro_y = random.uniform(-30, 30)
  gyro_z = random.uniform(-30, 30)

  mag_x = random.uniform(-500, 500)
  mag_y = random.uniform(-500, 500)
  mag_z = random.uniform(-500, 500)

  pressure_pa = 101325.0 + random.uniform(-500, 500)
  temperature_c = 25.0 + random.uniform(-2, 2)

  latitude = int((37.3852298 + 0.001 * math.sin(2 * math.pi * elapsed / 15)) * 1e7)
  longitude = int((-6.0154051 + 0.001 * math.cos(2 * math.pi * elapsed / 15)) * 1e7)

  altitude = 100 + (50 * (elapsed % 10))
  velocity_z = random.uniform(-5, 5)

  sensor_data = struct.pack(
    SENSOR_DATA_FMT,
    0xCAFE,
    timestamp_ms,
    accel_x, accel_y, accel_z,
    gyro_x, gyro_y, gyro_z,
    mag_x, mag_y, mag_z,
    pressure_pa, temperature_c,
    latitude, longitude,
    altitude, velocity_z,
  )

  event_type = 0
  cmd_type = 0
  state_event = struct.pack(STATE_EVENT_FMT, event_type, sensor_data, cmd_type)

  raw = bytes([state_byte]) + state_event
  hex_str = raw.hex().upper()
  return (hex_str + "\r\n").encode("ascii")

def main():
  try:
    with Serial(COM_PORT, COM_BAUDRATE, timeout=1) as ser:
      print(f"CONNECTED TO {COM_PORT} AT {COM_BAUDRATE} BAUD")
      print(f"SENDING HEX LINES AT {PACKET_FREQUENCY} Hz")
      while True:
        line = build_hex_line()
        ser.write(line)
        ser.flush()
        time.sleep(1 / PACKET_FREQUENCY)
  except SerialException as e:
    print(f"ERROR OPENING SERIAL PORT {COM_PORT}: {e}")
  except KeyboardInterrupt:
    print("STOPPED BY USER")

if __name__ == "__main__":
  main()
