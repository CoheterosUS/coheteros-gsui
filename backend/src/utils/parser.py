import struct
import math
import time

from ..utils.logger import logger

FLIGHT_DATA_FMT = "<HI9f2f2i4fIfBBB"
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
    tick,
    accel_x, accel_y, accel_z,
    gyro_x, gyro_y, gyro_z,
    mag_x, mag_y, mag_z,
    pressure_pa, temperature_c,
    latitude, longitude,
    altitude, vel_x, vel_y, vel_z,
    flags, battery_voltage, state, relay_state, sync_end,
  ) = struct.unpack(FLIGHT_DATA_FMT, raw)

  if sync != SYNC_WORD or sync_end != SYNC_END:
    logger(f"BAD SYNC: {sync:#06x}/{sync_end:#04x}", "ERROR")
    return None

  timestamp = int(time.time() * 1000)

  return {
    "sync":             sync,
    "tick":             tick,
    "timestamp":         timestamp,
    "ground_timestamp":  time.time(),
    "state":             state,
    "altitude":          altitude,
    "accelX":            accel_x,
    "accelY":            accel_y,
    "accelZ":            accel_z,
    "gyroX":             gyro_x,
    "gyroY":             gyro_y,
    "gyroZ":             gyro_z,
    "magX":              mag_x,
    "magY":              mag_y,
    "magZ":              mag_z,
    "latitude":          latitude,
    "longitude":         longitude,
    "pressurePa":        pressure_pa,
    "temperatureC":      temperature_c,
    "velX":              vel_x,
    "velY":              vel_y,
    "velZ":              vel_z,
    "batteryVoltage":    battery_voltage,
    "flags":             flags,
    "relayState":        relay_state,
    "syncEnd":           sync_end,
  }
