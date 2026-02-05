import json

from fastapi import WebSocket

from ..utils.utils import get_packet
from ..managers.state import StateManager
from ..managers.serial import SerialManager

async def execute (websocket: WebSocket, data: dict, state: StateManager, serial_manager: SerialManager):
  if serial_manager is not None and not state.record_csv:
    state.record_csv = True
    serial_manager.start_csv_record()

  websocket_send = get_packet(
    "NOTIFICATION_PACKET",
    "CSV RECORDING STARTED",
    "SUCCESS"
  )

  await websocket.send_text(json.dumps(websocket_send))
