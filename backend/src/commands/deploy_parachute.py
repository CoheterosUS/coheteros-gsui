import json

from fastapi import WebSocket

from ..state.state import WebsocketState
from ..utils.utils import get_packet
from ..serial.manager import SerialManager

async def execute (websocket: WebSocket, data: dict, state: WebsocketState, serial_manager: SerialManager):
  websocket_send = get_packet(
    "NOTIFICATION_PACKET",
    "DEPLOYED PARACHUTE",
    "SUCCESS"
  )

  await websocket.send_text(json.dumps(websocket_send))
