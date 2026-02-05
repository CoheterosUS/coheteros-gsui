import json

from fastapi import WebSocket

from ..utils.utils import get_packet
from ..managers.state import StateManager
from ..managers.serial import SerialManager

# TODO: Investigate dumping
async def execute (websocket: WebSocket, data: dict, state: StateManager, serial_manager: SerialManager):
  if serial_manager is not None:
    serial_manager.dump_csv_record()

  websocket_send = get_packet(
    "NOTIFICATION_PACKET",
    "CSV RECORDING DUMPED",
    "SUCCESS"
  )

  await websocket.send_text(json.dumps(websocket_send))
