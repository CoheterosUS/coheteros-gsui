import json

from fastapi import WebSocket

from ..state.state import WebsocketState
from ..utils.packet import get_packet

async def execute (websocket: WebSocket, data: dict, state: WebsocketState):
  state.send_fake_packets = False
  websocket_send = get_packet(
    "NOTIFICATION_PACKET",
    "STOPPED FAKE PACKETS"
  )

  await websocket.send_text(json.dumps(websocket_send))
