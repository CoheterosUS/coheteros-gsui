import struct
import math
import time

from ..utils.logger import logger

FLIGHT_DATA_FMT = "<H9f2f2i2fIfBB"
FLIGHT_DATA_SIZE = struct.calcsize(FLIGHT_DATA_FMT)
FLIGHT_DATA_LENGTH = FLIGHT_DATA_SIZE * 2

SYNC_WORD = 0xCAFE
SYNC_BYTES = struct.pack("<H", SYNC_WORD)

SYNC_END = 0xBE

def parse_hex_line (hex_line: str) -> dict | None:
  hex_line = hex_line.strip()
  length = len(hex_line)

  try:
    raw = bytes.fromhex(hex_line)
  except ValueError:
    logger("INVALID HEX IN PACKET", "ERROR")
    return None

  if length != FLIGHT_DATA_LENGTH:
    logger(f"BAD HEX LENGTH: {length} (EXPECTED {FLIGHT_DATA_LENGTH})", "ERROR")
    return None

  (
    sync,
    accel_x, accel_y, accel_z,
    gyro_x, gyro_y, gyro_z,
    mag_x, mag_y, mag_z,
    pressure_pa, temperature_c,
    latitude, longitude,
    altitude, velocity_z,
    flags, battery_voltage, state, sync_end,
  ) = struct.unpack(FLIGHT_DATA_FMT, raw)

  if sync != SYNC_WORD or sync_end != SYNC_END:
    logger(f"BAD SYNC: {sync:#06x}/{sync_end:#04x}", "ERROR")
    return None

  timestamp = int(time.time() * 1000)

  return {
    "sync":             sync,
    "timestamp":         timestamp,
    "ground_timestamp":  time.time(),
    "flightStatus":      state,
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
    "batteryVoltage":    battery_voltage,
    "flags":             flags,
  }
