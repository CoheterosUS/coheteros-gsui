import json

from fastapi import WebSocket

from ..utils.utils import get_packet
from ..managers.state import StateManager
from ..managers.serial import SerialManager

async def execute (websocket: WebSocket, data: dict, state: StateManager, serial_manager: SerialManager):
  input_port = data.get("input_port")
  baudrate = data.get("baudrate")

  state.send_fake_telemetry = False

  if serial_manager is not None:
    serial_manager.disconnect()

  success = await serial_manager.connect(input_port, int(baudrate))
  if success:
    state.input_port = input_port
    state.baudrate = int(baudrate)

  websocket_send = get_packet(
    "NOTIFICATION_PACKET",
    f"CONNECTED TO {input_port}@{baudrate}" if success else
    f"FAILED TO CONNECT TO {input_port}@{baudrate}",
    "SUCCESS" if success else "ERROR"
  )

  await websocket.send_text(json.dumps(websocket_send))
