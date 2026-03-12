from dataclasses import asdict
import json
from fastapi import WebSocket

from .state_schema import StateSchema
from ..utils.logger import logger
from ..utils.utils import get_available_serial_ports

class StateManager:
  def __init__ (self, schema: type[StateSchema]):
    self.schema = schema

    self.serial_port: str | None = None
    self.serial_baudrate: int | None = None
    self.serial_available_ports: list[str] = get_available_serial_ports()
    self.is_sending_fake_telemetry: bool = False
    self.is_recording_csv: bool = False

    self._active_websockets: set[WebSocket] = set()

  def get (self) -> StateSchema:
    return self.schema(
      serial_port=self.serial_port,
      serial_baudrate=self.serial_baudrate,
      serial_available_ports=get_available_serial_ports(),
      is_sending_fake_telemetry=self.is_sending_fake_telemetry,
      is_recording_csv=self.is_recording_csv
    )

  def update (self, key: str, value: object) -> None:
    if hasattr(self, key):
      setattr(self, key, value)

  def add_websocket (self, websocket: WebSocket) -> None:
    self._active_websockets.add(websocket)

  def remove_websocket (self, websocket: WebSocket) -> None:
    self._active_websockets.discard(websocket)

  async def broadcast_packet (self, packet: dict) -> None:
    text = json.dumps(packet)
    for websocket in self._active_websockets:
      try:
        await websocket.send_text(text)
      except Exception as e:
        logger(f"ERROR SENDING PACKET TO WEBSOCKET: {e}", "ERROR")

  async def broadcast_state (self) -> None:
    packet = {
      "type": "STATE_UPDATE_PACKET",
      "data": json.dumps(asdict(self.get()))
    }
    await self.broadcast_packet(packet)

  async def broadcast_notification (self, message: str, category: str = "INFO") -> None:
    packet = {
      "type": "NOTIFICATION_PACKET",
      "data": message,
      "category": category
    }
    await self.broadcast_packet(packet)

global_state = StateManager(StateSchema)
