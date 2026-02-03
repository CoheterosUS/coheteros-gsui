import json

from fastapi import WebSocket

from ..utils.packet import get_packet
from ..state.state import WebsocketState
from ..serial.manager import SerialManager

async def execute (websocket: WebSocket, data: dict, state: WebsocketState, serial_manager: SerialManager):
  if serial_manager is not None:
    serial_manager.disconnect()

  websocket_send = get_packet(
    "NOTIFICATION_PACKET",
    "DISCONNECTED" if state.input_port is None else f"DISCONNECTED FROM {state.input_port}@{state.baudrate}"
  )

  state.input_port = None
  state.baudrate = None

  await websocket.send_text(json.dumps(websocket_send))
