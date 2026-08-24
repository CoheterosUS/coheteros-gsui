import struct
import math
import time

from ..utils.logger import logger

FLIGHT_DATA_FMT = "<HI14iB5iIiBBBB"
FLIGHT_DATA_SIZE = struct.calcsize(FLIGHT_DATA_FMT)
FLIGHT_DATA_LENGTH = FLIGHT_DATA_SIZE * 2

SYNC_WORD = 0xCAFE
SYNC_BYTES = struct.pack("<H", SYNC_WORD)

SYNC_END = 0xBE

# every int32 field except latitude/longitude is a float scaled by this factor
SCALE = 100.0

# outbound command frame: sync word, command byte, payload length, footer
COMMAND_FMT = "<HBBB"
COMMAND_SIZE = struct.calcsize(COMMAND_FMT)

COMMAND_BYTES = {
  "RESET": 0x01,
  "GROUND_ABORT": 0x02,
  "CALIBRATION": 0x03,
  "DROGUE": 0x04,
}

def build_command_frame (command: str) -> bytes | None:
  cmd_byte = COMMAND_BYTES.get(command)
  if cmd_byte is None:
    logger(f"UNKNOWN FLIGHT COMMAND: {command}", "ERROR")
    return None

  return struct.pack(COMMAND_FMT, SYNC_WORD, cmd_byte, 0x00, SYNC_END)

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
    gps_altitude, satellites,
    barometric_altitude, barometric_velocity,
    vel_x, vel_y, vel_z,
    flags, battery_voltage, state, relay_state, last_command, sync_end,
  ) = struct.unpack(FLIGHT_DATA_FMT, raw)

  if sync != SYNC_WORD or sync_end != SYNC_END:
    logger(f"BAD SYNC: {sync:#06x}/{sync_end:#04x}", "ERROR")
    return None

  timestamp = int(time.time() * 1000)

  return {
    "sync":                sync,
    "tick":                tick,
    "timestamp":           timestamp,
    "ground_timestamp":    time.time(),
    "state":               state,
    "accelX":              accel_x / SCALE,
    "accelY":              accel_y / SCALE,
    "accelZ":              accel_z / SCALE,
    "gyroX":               gyro_x / SCALE,
    "gyroY":               gyro_y / SCALE,
    "gyroZ":               gyro_z / SCALE,
    "magX":                mag_x / SCALE,
    "magY":                mag_y / SCALE,
    "magZ":                mag_z / SCALE,
    "pressurePa":          pressure_pa / SCALE,
    "temperatureC":        temperature_c / SCALE,
    # latitude/longitude stay raw (degrees x 10^7), the frontend divides them
    "latitude":            latitude,
    "longitude":           longitude,
    "gpsAltitude":         gps_altitude / SCALE,
    "satellites":          satellites,
    "barometricAltitude":  barometric_altitude / SCALE,
    "barometricVelocity":  barometric_velocity / SCALE,
    "velX":                vel_x / SCALE,
    "velY":                vel_y / SCALE,
    "velZ":                vel_z / SCALE,
    "flags":               flags,
    "batteryVoltage":      battery_voltage / SCALE,
    "relayState":          relay_state,
    "lastCommand":         last_command,
    "syncEnd":             sync_end,
  }
