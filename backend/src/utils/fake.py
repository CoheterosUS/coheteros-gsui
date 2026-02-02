import time
import random
import math

START_TIME = time.time()

def create_fake_data ():
  """Create fake telemetry packet"""
  packet: dict[str, float | int] = {}

  elapsed = time.time() - START_TIME
  packet['altitude'] = 100 + (50 * (elapsed % 10))
  packet['gpsAltitude'] = packet['altitude'] + random.uniform(-5, 5)
  packet['flightStatus'] = int((elapsed // 10) % 4) + 1
  packet['accelerationX'] = random.uniform(-2, 2)
  packet['accelerationY'] = random.uniform(-2, 2)
  packet['accelerationZ'] = 9.8 + random.uniform(-0.5, 0.5)
  packet['totalAcceleration'] = math.sqrt(
    packet['accelerationX']**2 + 
    packet['accelerationY']**2 + 
    packet['accelerationZ']**2
  )
  packet['gyroscopeX'] = random.uniform(-30, 30)
  packet['gyroscopeY'] = random.uniform(-30, 30)
  packet['gyroscopeZ'] = random.uniform(-30, 30)
  packet['roll'] = (360 * (elapsed / 15)) % 360 - 180
  packet['pitch'] = 82.5 + 7.5 * math.sin(2 * math.pi * elapsed / 10)
  packet['yaw'] = 15 * math.sin(2 * math.pi * elapsed / 5)
  packet['gpsLatitude'] = 37.3852298 + 0.001 * math.sin(2 * math.pi * elapsed / 15)
  packet['gpsLongitude'] = -6.0154051 + 0.001 * math.cos(2 * math.pi * elapsed / 15)
  packet['payloadAltitude'] = 0
  packet['payloadLatitude'] = 37.3852298
  packet['payloadLongitude'] = -6.0154051
  packet['batteryVoltage'] = 11.5 + random.uniform(-0.1, 0.1)
  packet['temperature'] = 25.0 + random.uniform(-2, 2)
  packet['timestamp'] = elapsed

  return packet
