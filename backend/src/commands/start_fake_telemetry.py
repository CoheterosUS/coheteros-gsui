import json

from fastapi import WebSocket

from ..state.state import WebsocketState
from ..utils.utils import get_packet
from ..serial.manager import SerialManager

async def execute (websocket: WebSocket, data: dict, state: WebsocketState, serial_manager: SerialManager):
  if serial_manager is not None:
    serial_manager.disconnect()
    state.reset()

  state.send_fake_telemetry = True
  websocket_send = get_packet(
    "NOTIFICATION_PACKET",
    "STARTED FAKE TELEMETRY",
    "SUCCESS"
  )

  await websocket.send_text(json.dumps(websocket_send))
