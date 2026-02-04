import time
import json

from serial import Serial, SerialException

from os import getenv
from dotenv import load_dotenv

from src.utils.fake import create_fake_data

load_dotenv()

COM_PAIR = getenv("VITE_TESTING_COM_PAIR", "COM2")
COM_BAUDRATE = int(getenv("VITE_TESTING_COM_BAUDRATE", 115200))
PACKET_FREQUENCY = int(getenv("VITE_PACKET_FREQUENCY", 10))

def main ():
  try:
    with Serial(COM_PAIR, COM_BAUDRATE, timeout=1) as ser:
      print(f"CONNECTED TO {COM_PAIR} AT {COM_BAUDRATE} BAUD")
      while True:
        data = create_fake_data()
        json_data = json.dumps(data)
        ser.write((json_data + "\n").encode('utf-8'))
        time.sleep(1 / PACKET_FREQUENCY)
  except SerialException as e:
    print(f"ERROR OPENING SERIAL PORT {COM_PAIR}: {e}")
  except KeyboardInterrupt:
    print("STOPPED BY USER")
if __name__ == "__main__":
  main()
