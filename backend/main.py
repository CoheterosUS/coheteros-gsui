import asyncio
import json
import uvicorn
import threading
import webview
import sys

from os import getenv, path
from dotenv import load_dotenv

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from src.utils.fake import create_fake_data
from src.utils.utils import get_controls_status
from src.managers.state import StateManager
from src.managers.serial import SerialManager

import src.commands.start_fake_telemetry
import src.commands.stop_fake_telemetry
import src.commands.deploy_parachute
import src.commands.connect_serial
import src.commands.disconnect_serial
import src.commands.start_csv_record
import src.commands.stop_csv_record

load_dotenv()

BACKEND_PORT = int(getenv("VITE_BACKEND_PORT", 8000))
PACKET_FREQUENCY = int(getenv("VITE_PACKET_FREQUENCY", 10))
MODE = getenv("VITE_MODE", "PROD")

BASE_DIR = path.dirname(path.abspath(__file__))
DIST_DIR = path.join(BASE_DIR, "..", "dist")

app = FastAPI()
state = StateManager()
serial_manager = SerialManager()

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"]
)

app.add_middleware(
  GZipMiddleware,
  minimum_size=1000
)

commands = {
  "START_FAKE_TELEMETRY": src.commands.start_fake_telemetry,
  "STOP_FAKE_TELEMETRY": src.commands.stop_fake_telemetry,
  "DEPLOY_PARACHUTE": src.commands.deploy_parachute,
  "CONNECT_SERIAL": src.commands.connect_serial,
  "DISCONNECT_SERIAL": src.commands.disconnect_serial,
  "START_CSV_RECORD": src.commands.start_csv_record,
  "STOP_CSV_RECORD": src.commands.stop_csv_record
}

@app.get("/api/controls")
async def get_controls ():
  return get_controls_status(state)

@app.websocket("/ws")
async def websocket_endpoint (websocket: WebSocket):
  await websocket.accept()

  async def send_packets ():
    try:
      while True:
        if state.send_fake_telemetry and MODE == "TEST":
          fake_data = create_fake_data()

          if state.record_csv:
            serial_manager.write_csv(fake_data)

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

              if state.record_csv:
                serial_manager.write_csv(telemetry_data)

              telemetry_packet = {
                "type": "TELEMETRY_PACKET",
                "data": telemetry_data
              }

              await websocket.send_text(json.dumps(telemetry_packet))
          else:
            await asyncio.sleep(0.01)
        else:
          await asyncio.sleep(0.1)
    except asyncio.CancelledError:
      raise

  async def receive_packets ():
    try:
      async for message in websocket.iter_text():
        await handle_command(message)
    except WebSocketDisconnect as e:
      print(f"WEBSOCKET DISCONNECTED: {e}")
      raise

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

if MODE == "PROD":
  if not path.exists(DIST_DIR):
    print(f"DIST DIRECTORY NOT FOUND AT {DIST_DIR}. FRONTEND NOT SERVED.")
  else:
    app.mount("/assets", StaticFiles(directory=path.join(DIST_DIR, "assets")), name="assets")
    app.mount("/fonts", StaticFiles(directory=path.join(DIST_DIR, "fonts")), name="fonts")
    app.mount("/model", StaticFiles(directory=path.join(DIST_DIR, "model")), name="model")
    app.mount("/images", StaticFiles(directory=path.join(DIST_DIR, "images")), name="images")

    @app.get("/{full_path:path}")
    async def serve_frontend (full_path: str):
      return FileResponse(path.join(DIST_DIR, "index.html"))

def start_server ():
  print(f"STARTING BACKEND ON PORT {BACKEND_PORT} IN {MODE} MODE")
  if MODE == "PROD" and path.exists(DIST_DIR):
    print(f"SERVING FRONTEND ON PORT {BACKEND_PORT} IN {MODE} MODE")

  uvicorn.run(app, host="localhost", port=BACKEND_PORT)

if __name__ == "__main__":
  if MODE == "TEST":
    start_server()
  else:
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()

    webview.create_window(
      "Coheteros US Ground Station",
      f"http://localhost:{BACKEND_PORT}",
      maximized=True
    )
    webview.start()
    sys.exit()
