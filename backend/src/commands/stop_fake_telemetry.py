import json

from fastapi import WebSocket

from ..state.state import WebsocketState
from ..utils.packet import get_packet
from ..serial.manager import SerialManager

async def execute (websocket: WebSocket, data: dict, state: WebsocketState, serial_manager: SerialManager):
  state.send_fake_telemetry = False
  websocket_send = get_packet(
    "NOTIFICATION_PACKET",
    "STOPPED FAKE TELEMETRY"
  )

  await websocket.send_text(json.dumps(websocket_send))
