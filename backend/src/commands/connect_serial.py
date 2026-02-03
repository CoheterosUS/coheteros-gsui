import json

from fastapi import WebSocket

from ..utils.packet import get_packet
from ..state.state import WebsocketState
from ..serial.manager import SerialManager

async def execute (websocket: WebSocket, data: dict, state: WebsocketState, serial_manager: SerialManager):
  state.input_port = data.get("input_port")
  state.baudrate = data.get("baudrate", "9600")
  state.send_fake_telemetry = False

  if serial_manager is not None:
    serial_manager.disconnect()
    serial_manager.set_ports(state.input_port, int(state.baudrate))
    serial_manager.connect()

  websocket_send = get_packet(
    "NOTIFICATION_PACKET",
    f"CONNECTED TO {state.input_port}@{state.baudrate}"
  )

  await websocket.send_text(json.dumps(websocket_send))
