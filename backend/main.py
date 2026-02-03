import asyncio
import json
import uvicorn

from os import getenv
from dotenv import load_dotenv

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from src.utils.fake import create_fake_data
from src.serial.utils import get_serial_ports
from src.state.state import WebsocketState
from src.serial.manager import SerialManager

import src.commands.start_fake_telemetry
import src.commands.stop_fake_telemetry
import src.commands.deploy_parachute
import src.commands.connect_serial
import src.commands.disconnect_serial

load_dotenv()

PORT = int(getenv("VITE_WS_PORT", 8000))
TESTING_MODE = getenv("VITE_TESTING_MODE", "FALSE") == "TRUE"
PACKET_FREQUENCY = int(getenv("VITE_PACKET_FREQUENCY", 10))

app = FastAPI()
serial_manager = SerialManager()

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"]
)

commands = {
  "START_FAKE_TELEMETRY": src.commands.start_fake_telemetry,
  "STOP_FAKE_TELEMETRY": src.commands.stop_fake_telemetry,
  "DEPLOY_PARACHUTE": src.commands.deploy_parachute,
  "CONNECT_SERIAL": src.commands.connect_serial,
  "DISCONNECT_SERIAL": src.commands.disconnect_serial
}

@app.get("/ports")
async def get_serial():
  return get_serial_ports()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
  await websocket.accept()
  state = WebsocketState()

  async def send_packets ():
    try:
      while True:
        if state.send_fake_telemetry and TESTING_MODE:
          fake_data = create_fake_data()
          fake_packet = {
            "type": "TELEMETRY_PACKET",
            "data": fake_data
          }

          await websocket.send_text(json.dumps(fake_packet))
          await asyncio.sleep(1 / PACKET_FREQUENCY)
          continue

        if serial_manager is not None and serial_manager.is_connected:
          line = await serial_manager.read_line()
          if line is not None:
            telemetry_data = serial_manager.parse_telemetry(line)
            if telemetry_data is not None:
              telemetry_packet = {
                "type": "TELEMETRY_PACKET",
                "data": telemetry_data
              }

              await websocket.send_text(json.dumps(telemetry_packet))
          else:
            await asyncio.sleep(0.01)
        else:
          await asyncio.sleep(0.1)
    except asyncio.CancelledError as e:
      print(f"SEND PACKETS TASK CANCELLED: {e}")
      pass

  async def receive_packets ():
    try:
      async for message in websocket.iter_text():
        await handle_command(message)
    except WebSocketDisconnect as e:
      print(f"WEBSOCKET DISCONNECTED: {e}")
      pass

  async def handle_command (message: str):
    try:
      json_msg = json.loads(message)
      command_type = json_msg.get("type")
      command_data = json.loads(json_msg.get("data", "{}"))

      print(f"RECEIVED COMMAND: {command_type} | DATA: {command_data}")
      if command_type in commands:
        await commands[command_type].execute(websocket, command_data, state, serial_manager)
      else:
        print(f"UNKNOWN COMMAND: {command_type}")
    except json.JSONDecodeError:
      print("INVALID JSON")
      pass

  send_task = asyncio.create_task(send_packets())
  receive_task = asyncio.create_task(receive_packets())

  try:
    await asyncio.wait(
      [send_task, receive_task],
      return_when=asyncio.FIRST_COMPLETED
    )
  finally:
    send_task.cancel()
    receive_task.cancel()

    if serial_manager is not None:
      await asyncio.to_thread(serial_manager.disconnect)

if __name__ == "__main__":
  uvicorn.run(app, host="localhost", port=PORT)
