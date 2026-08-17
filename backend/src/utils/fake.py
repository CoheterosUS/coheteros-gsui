import time
import random
import math

START_TIME = time.time()

def create_fake_data () -> dict[str, float | int]:
  packet: dict[str, float | int] = {}

  elapsed = time.time() - START_TIME
  packet['tick'] = int(elapsed * 1000)
  packet['timestamp'] = int(elapsed * 1000)
  packet['ground_timestamp'] = time.time()
  packet['sync'] = 0xCAFE
  packet['state'] = int((elapsed // 10) % 4) + 1
  packet['altitude'] = 100 + (50 * (elapsed % 10))
  packet['accelX'] = random.uniform(-2, 2)
  packet['accelY'] = random.uniform(-2, 2)
  packet['accelZ'] = 9.8 + random.uniform(-0.5, 0.5)
  packet['gyroX'] = random.uniform(-30, 30)
  packet['gyroY'] = random.uniform(-30, 30)
  packet['gyroZ'] = random.uniform(-30, 30)
  packet['magX'] = random.uniform(-500, 500)
  packet['magY'] = random.uniform(-500, 500)
  packet['magZ'] = random.uniform(-500, 500)
  packet['latitude'] = int((37.3852298 + 0.001 * math.sin(2 * math.pi * elapsed / 15)) * 1e7)
  packet['longitude'] = int((-6.0154051 + 0.001 * math.cos(2 * math.pi * elapsed / 15)) * 1e7)
  packet['temperatureC'] = 25.0 + random.uniform(-2, 2)
  packet['pressurePa'] = 101325.0 + random.uniform(-500, 500)
  packet['velX'] = 0
  packet['velY'] = random.uniform(-5, 5)
  packet['velZ'] = 0
  packet['batteryVoltage'] = 12.6 - (0.01 * elapsed) + random.uniform(-0.05, 0.05)
  packet['flags'] = 0
  packet['relayState'] = 0
  packet['syncEnd'] = 0xBE

  return packet
