import asyncio
import json
import uvicorn

from os import getenv, path
from dotenv import load_dotenv

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from src.state.state_manager import global_state
from src.serial.serial_manager import global_serial
from src.utils.logger import logger
from src.dispatchers.dispatcher import command_dispatch
from src.utils.fake import create_fake_data
from src.utils.parser import parse_packet

load_dotenv()

BASE_DIR = path.dirname(path.abspath(__file__))
DIST_DIR = path.join(BASE_DIR, "..", "dist")

BACKEND_PORT = int(getenv("VITE_BACKEND_PORT", 8000))
PACKET_FREQUENCY = int(getenv("PACKET_FREQUENCY", 20))

PACKET_INTERVAL = 1.0 / PACKET_FREQUENCY

app = FastAPI()
broadcast_task: asyncio.Task | None = None

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"]
)

async def broadcast_loop ():
  while True:
    try:
      if global_state.is_sending_fake_telemetry:
        fake_data = create_fake_data()
        encoded_data = json.dumps(fake_data)
        packet = {"type": "TELEMETRY_PACKET", "data": encoded_data}
        await global_state.broadcast_packet(packet)
        await asyncio.sleep(PACKET_INTERVAL)
      elif global_state.serial_port:
        try:
          serial_data = await asyncio.wait_for(global_serial.async_queue.get(), timeout=0.1)
        except asyncio.TimeoutError:
          continue
        parsed_data = parse_packet(serial_data)
        encoded_data = json.dumps(parsed_data)
        packet = {"type": "TELEMETRY_PACKET", "data": encoded_data}
        await global_state.broadcast_packet(packet)
      else:
        await asyncio.sleep(PACKET_INTERVAL)
    except asyncio.CancelledError:
      break
    except Exception as e:
      logger(f"ERROR IN BROADCAST LOOP: {e}", "ERROR")
      await asyncio.sleep(0.1)

@app.get("/api/status")
async def endpoint_api_status ():
  return global_state.get()

@app.websocket("/ws")
async def endpoint_ws (websocket: WebSocket):
  await websocket.accept()

  global_state.add_websocket(websocket)

  try:
    while True:
      packet_data = await websocket.receive_json()
      command = packet_data.get("type")
      data = packet_data.get("data", {})

      await command_dispatch(command, data)
  except WebSocketDisconnect:
    pass
  except Exception as e:
    logger(f"ERROR IN WEBSOCKET: {e}", "ERROR")
  finally:
    global_state.remove_websocket(websocket)

async def start_server ():
  global broadcast_task
  broadcast_task = asyncio.create_task(broadcast_loop())

  if path.isdir(DIST_DIR):
    app.mount("/assets", StaticFiles(directory=path.join(DIST_DIR, "assets")), name="assets")
    app.mount("/fonts", StaticFiles(directory=path.join(DIST_DIR, "fonts")), name="fonts")
    app.mount("/images", StaticFiles(directory=path.join(DIST_DIR, "images")), name="images")
    app.mount("/model", StaticFiles(directory=path.join(DIST_DIR, "model")), name="model")

    @app.get("/{full_path:path}")
    async def serve_spa (full_path: str):
      file_path = path.join(DIST_DIR, full_path)
      if full_path and path.isfile(file_path):
        return FileResponse(file_path)
      return FileResponse(path.join(DIST_DIR, "index.html"))

    logger("SERVING FRONTEND FROM DIST FOLDER")
  else:
    logger("DIST FOLDER NOT FOUND, SKIPPING FRONTEND SERVING", "WARNING")

  uv_config = uvicorn.Config(app, host="localhost", port=BACKEND_PORT)
  uv_server = uvicorn.Server(uv_config)
  await uv_server.serve()
  broadcast_task.cancel()

if __name__ == "__main__":
  asyncio.run(start_server())
