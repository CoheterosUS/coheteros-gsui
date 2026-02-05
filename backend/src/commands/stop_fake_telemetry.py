import json

from fastapi import WebSocket

from ..utils.utils import get_packet
from ..managers.state import StateManager
from ..managers.serial import SerialManager

async def execute (websocket: WebSocket, data: dict, state: StateManager, serial_manager: SerialManager):
  state.send_fake_telemetry = False
  websocket_send = get_packet(
    "NOTIFICATION_PACKET",
    "STOPPED FAKE TELEMETRY",
    "SUCCESS"
  )

  await websocket.send_text(json.dumps(websocket_send))
