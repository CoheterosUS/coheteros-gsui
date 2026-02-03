import json

from fastapi import WebSocket

from ..utils.packet import get_packet
from ..state.state import WebsocketState

async def execute (websocket: WebSocket, data: dict, state: WebsocketState):
  state.input_port = data.get("input_port")
  state.output_port = data.get("output_port")
  state.send_fake_packets = False
  websocket_send = get_packet(
    "NOTIFICATION_PACKET",
    f"SET PORTS\nINPUT: {state.input_port}\nOUTPUT: {state.output_port}"
  )

  await websocket.send_text(json.dumps(websocket_send))
