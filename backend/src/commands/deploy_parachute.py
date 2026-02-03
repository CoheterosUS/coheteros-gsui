import json

from fastapi import WebSocket

from ..state.state import WebsocketState
from ..utils.packet import get_packet

async def execute (websocket: WebSocket, data: dict, state: WebsocketState):
  websocket_send = get_packet(
    "NOTIFICATION_PACKET",
    "DEPLOYED PARACHUTE"
  )

  await websocket.send_text(json.dumps(websocket_send))
