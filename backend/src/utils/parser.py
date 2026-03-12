import struct
import time

# 37 bytes total
PACKET_FORMAT = "<iBBhhhhhhhhHiihhB"
PACKET_SIZE = struct.calcsize(PACKET_FORMAT)

def parse_packet (raw: bytes) -> dict:
  """Unpack 37-byte binary telemetry struct"""
  (
    altitude, gps_altitude, flight_status,
    acc_x, acc_y, acc_z,
    gyro_x, gyro_y, gyro_z,
    roll, pitch, yaw,
    gps_lat, gps_lon,
    battery_voltage, temperature, timestamp
  ) = struct.unpack(PACKET_FORMAT, raw)

  ax = acc_x / 1000.0
  ay = acc_y / 1000.0
  az = acc_z / 1000.0

  return {
    "timestamp":         timestamp,
    "ground_timestamp":  time.time(),
    "altitude":          altitude / 100.0,
    "gpsAltitude":       gps_altitude,
    "flightStatus":      flight_status,
    "accelerationX":     ax,
    "accelerationY":     ay,
    "accelerationZ":     az,
    "totalAcceleration": 0,
    "gyroscopeX":        gyro_x / 100.0,
    "gyroscopeY":        gyro_y / 100.0,
    "gyroscopeZ":        gyro_z / 100.0,
    "roll":              roll / 10.0,
    "pitch":             pitch / 10.0,
    "yaw":               yaw / 100.0,
    "gpsLatitude":       gps_lat / 100000.0,
    "gpsLongitude":      gps_lon / 100000.0,
    "payloadAltitude":   0,
    "payloadLatitude":   0,
    "payloadLongitude":  0,
    "batteryVoltage":    battery_voltage / 100.0,
    "temperature":       temperature / 10.0,
  }
