import time
import random
import math

START_TIME = time.time()

def create_fake_data () -> dict[str, float | int]:
  packet: dict[str, float | int] = {}

  elapsed = time.time() - START_TIME
  packet['timestamp'] = int(elapsed * 1000)
  packet['ground_timestamp'] = time.time()
  packet['flightStatus'] = int((elapsed // 10) % 4) + 1
  packet['sync'] = 0xCAFE
  packet['altitude'] = 100 + (50 * (elapsed % 10))
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
  packet['magnetometerX'] = random.uniform(-500, 500)
  packet['magnetometerY'] = random.uniform(-500, 500)
  packet['magnetometerZ'] = random.uniform(-500, 500)
  packet['gpsLatitude'] = 37.3852298 + 0.001 * math.sin(2 * math.pi * elapsed / 15)
  packet['gpsLongitude'] = -6.0154051 + 0.001 * math.cos(2 * math.pi * elapsed / 15)
  packet['temperature'] = 25.0 + random.uniform(-2, 2)
  packet['pressure'] = 101325.0 + random.uniform(-500, 500)
  packet['velocityZ'] = random.uniform(-5, 5)
  packet['batteryVoltage'] = 12.6 - (0.01 * elapsed) + random.uniform(-0.05, 0.05)
  packet['flags'] = 0

  return packet
