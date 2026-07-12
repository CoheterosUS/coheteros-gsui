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

FLIGHT_DATA_FMT = "<HI9f2f2i2fIfBB"

START_TIME = time.time()

def build_packet() -> bytes:
  elapsed = time.time() - START_TIME
  tick = int(elapsed * 1000)

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
  battery_voltage = 12.6 - (0.01 * elapsed) + random.uniform(-0.05, 0.05)
  flags = 0
  state = int((elapsed // 10) % 7)

  flight_data = struct.pack(
    FLIGHT_DATA_FMT,
    0xCAFE,
    tick,
    accel_x, accel_y, accel_z,
    gyro_x, gyro_y, gyro_z,
    mag_x, mag_y, mag_z,
    pressure_pa, temperature_c,
    latitude, longitude,
    altitude, velocity_z,
    flags,
    battery_voltage,
    state,
    0xBE,
  )

  return flight_data

def main():
  try:
    with Serial(COM_PORT, COM_BAUDRATE, timeout=1) as ser:
      print(f"CONNECTED TO {COM_PORT} AT {COM_BAUDRATE} BAUD")
      print(f"SENDING RAW PACKETS AT {PACKET_FREQUENCY} Hz")
      while True:
        ser.write(build_packet())
        ser.flush()
        time.sleep(1 / PACKET_FREQUENCY)
  except SerialException as e:
    print(f"ERROR OPENING SERIAL PORT {COM_PORT}: {e}")
  except KeyboardInterrupt:
    print("STOPPED BY USER")

if __name__ == "__main__":
  main()
