import json

from fastapi import WebSocket

from ..utils.utils import get_packet
from ..managers.state import StateManager
from ..managers.serial import SerialManager

async def execute (websocket: WebSocket, data: dict, state: StateManager, serial_manager: SerialManager):
  if serial_manager is not None:
    serial_manager.disconnect()
    state.input_port = None
    state.baudrate = None

  state.send_fake_telemetry = True
  websocket_send = get_packet(
    "NOTIFICATION_PACKET",
    "STARTED FAKE TELEMETRY",
    "SUCCESS"
  )

  await websocket.send_text(json.dumps(websocket_send))
