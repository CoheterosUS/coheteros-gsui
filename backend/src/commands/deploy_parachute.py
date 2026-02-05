import json

from fastapi import WebSocket

from ..utils.utils import get_packet
from ..managers.state import StateManager
from ..managers.serial import SerialManager

async def execute (websocket: WebSocket, data: dict, state: StateManager, serial_manager: SerialManager):
  websocket_send = get_packet(
    "NOTIFICATION_PACKET",
    "DEPLOYED PARACHUTE",
    "SUCCESS"
  )

  await websocket.send_text(json.dumps(websocket_send))
