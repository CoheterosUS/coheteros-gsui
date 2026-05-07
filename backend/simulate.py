import time
import struct
import random
import math

from serial import Serial, SerialException

from os import getenv
from dotenv import load_dotenv

load_dotenv()

COM_PORT = getenv("TESTING_COM_PORT", "COM2")
COM_BAUDRATE = int(getenv("TESTING_COM_BAUDRATE", 9600))
PACKET_FREQUENCY = int(getenv("PACKET_FREQUENCY", 10))

# Struct: Emisor.ino / Receptor.ino (37 bytes payload)
# struct PaqueteTelemetria {
#     int32_t  altitude;        4
#     uint8_t  gpsAltitude;     1
#     uint8_t  flightStatus;    1
#     int16_t  accX;            2
#     int16_t  accY;            2
#     int16_t  accZ;            2
#     int16_t  gyroX;           2
#     int16_t  gyroY;           2
#     int16_t  gyroZ;           2
#     int16_t  roll;            2
#     int16_t  pitch;           2
#     uint16_t yaw;             2
#     int32_t  gpsLatitude;     4
#     int32_t  gpsLongitude;    4
#     int16_t  batteryVoltage;  2
#     int16_t  temperature;     2
#     uint8_t  timestamp;       1
# };
PACKET_FORMAT = "<iBBhhhhhhhhHiihhB"
PACKET_SIZE = struct.calcsize(PACKET_FORMAT)  # 37
HEADER_BYTES = b"\xAA\xBB"
FOOTER_BYTES = b"\xEE\xFF"
FULL_PACKET_SIZE = len(HEADER_BYTES) + PACKET_SIZE + len(FOOTER_BYTES)

START_TIME = time.time()
_timestamp_counter = 0

def build_packet() -> bytes:
  global _timestamp_counter

  elapsed = time.time() - START_TIME
  _timestamp_counter = (_timestamp_counter + 1) % 256

  altitude = int((100 + 50 * (elapsed % 10)) * 100)                         # cm  (receptor / 100.0)
  gps_altitude = min(255, max(0, int(100 + 50 * (elapsed % 10) + random.uniform(-5, 5))))
  flight_status = int((elapsed // 10) % 4) + 1

  acc_x = int(random.uniform(-2, 2) * 1000)                                 # milli-g
  acc_y = int(random.uniform(-2, 2) * 1000)
  acc_z = int((9.8 + random.uniform(-0.5, 0.5)) * 1000)

  gyro_x = int(random.uniform(-30, 30) * 100)                               # centi-deg/s
  gyro_y = int(random.uniform(-30, 30) * 100)
  gyro_z = int(random.uniform(-30, 30) * 100)

  roll = int(((360 * (elapsed / 15)) % 360 - 180) * 10)                     # deci-deg  (receptor / 10.0)
  pitch = int((82.5 + 7.5 * math.sin(2 * math.pi * elapsed / 10)) * 10)     # deci-deg
  yaw_raw = 15 * math.sin(2 * math.pi * elapsed / 5)
  yaw = int(((yaw_raw % 360) + 360) % 360 * 100)                            # centi-deg (receptor / 100.0)

  gps_latitude = int(37.3852298 * 100000 + 100 * math.sin(2 * math.pi * elapsed / 15))
  gps_longitude = int(-6.0154051 * 100000 + 100 * math.cos(2 * math.pi * elapsed / 15))

  battery_voltage = int((11.5 + random.uniform(-0.1, 0.1)) * 100)           # centi-V  (receptor / 100.0)
  temperature = int((25.0 + random.uniform(-2, 2)) * 10)                    # deci-C   (receptor / 10.0)

  payload = struct.pack(
    PACKET_FORMAT,
    altitude,
    gps_altitude,
    flight_status,
    acc_x, acc_y, acc_z,
    gyro_x, gyro_y, gyro_z,
    roll, pitch, yaw,
    gps_latitude, gps_longitude,
    battery_voltage, temperature,
    _timestamp_counter,
  )
  return HEADER_BYTES + payload + FOOTER_BYTES

def main():
  try:
    with Serial(COM_PORT, COM_BAUDRATE, timeout=1) as ser:
      print(f"CONNECTED TO {COM_PORT} AT {COM_BAUDRATE} BAUD")
      print(f"SENDING {FULL_PACKET_SIZE}-BYTE BINARY PACKETS AT {PACKET_FREQUENCY} Hz")
      while True:
        packet = build_packet()
        ser.write(packet)
        ser.flush()
        time.sleep(1 / PACKET_FREQUENCY)
  except SerialException as e:
    print(f"ERROR OPENING SERIAL PORT {COM_PORT}: {e}")
  except KeyboardInterrupt:
    print("STOPPED BY USER")

if __name__ == "__main__":
  main()
