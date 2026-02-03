import json

from fastapi import WebSocket

from ..state.state import WebsocketState
from ..utils.packet import get_packet
from ..serial.manager import SerialManager

async def execute (websocket: WebSocket, data: dict, state: WebsocketState, serial_manager: SerialManager):
  if serial_manager is not None:
    serial_manager.disconnect()

  state.send_fake_telemetry = True
  websocket_send = get_packet(
    "NOTIFICATION_PACKET",
    "STARTED FAKE TELEMETRY"
  )

  await websocket.send_text(json.dumps(websocket_send))
