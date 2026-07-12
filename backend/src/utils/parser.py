import struct
import math
import time

from ..utils.logger import logger

SENSOR_DATA_FMT = "<HI11f2i2f"
SENSOR_DATA_SIZE = struct.calcsize(SENSOR_DATA_FMT)

STATE_EVENT_FMT = "<I66sI"
STATE_EVENT_SIZE = struct.calcsize(STATE_EVENT_FMT)

# Current firmware: state(1) + SensorData(66) + trailing(1) = 68 bytes = 136 hex
CURRENT_LINE_LENGTH = 136
# Target firmware: state(1) + StateEvent_t(74) = 75 bytes = 150 hex
TARGET_LINE_LENGTH = 150

FULL_LINE_LENGTH = CURRENT_LINE_LENGTH

def parse_hex_line (hex_line: str) -> dict | None:
  hex_line = hex_line.strip()
  length = len(hex_line)

  try:
    raw = bytes.fromhex(hex_line)
  except ValueError:
    logger("INVALID HEX IN PACKET", "ERROR")
    return None

  state_byte = raw[0]

  if length == TARGET_LINE_LENGTH:
    event_type, sd_bytes, cmd_type = struct.unpack(STATE_EVENT_FMT, raw[1:])
  elif length == CURRENT_LINE_LENGTH:
    sd_bytes = raw[1:1 + SENSOR_DATA_SIZE]
  else:
    logger(f"BAD HEX LENGTH: {length} (EXPECTED {CURRENT_LINE_LENGTH} OR {TARGET_LINE_LENGTH})", "ERROR")
    return None

  (
    sync, timestamp,
    accel_x, accel_y, accel_z,
    gyro_x, gyro_y, gyro_z,
    mag_x, mag_y, mag_z,
    pressure_pa, temperature_c,
    latitude, longitude,
    altitude, velocity_z,
  ) = struct.unpack(SENSOR_DATA_FMT, sd_bytes)

  return {
    "timestamp":         timestamp,
    "ground_timestamp":  time.time(),
    "flightStatus":      state_byte,
    "altitude":          altitude,
    "accelerationX":     accel_x,
    "accelerationY":     accel_y,
    "accelerationZ":     accel_z,
    "totalAcceleration": math.sqrt(accel_x**2 + accel_y**2 + accel_z**2),
    "gyroscopeX":        gyro_x,
    "gyroscopeY":        gyro_y,
    "gyroscopeZ":        gyro_z,
    "magnetometerX":     mag_x,
    "magnetometerY":     mag_y,
    "magnetometerZ":     mag_z,
    "gpsLatitude":       latitude / 1e7,
    "gpsLongitude":      longitude / 1e7,
    "temperature":       temperature_c,
    "pressure":          pressure_pa,
    "velocityZ":         velocity_z,
  }
