import json

from ..utils.packet import get_packet

async def execute (websocket, data, state):
  state.send_fake_packets = True
  websocket_send = get_packet(
    "NOTIFICATION_PACKET",
    "STARTED FAKE PACKETS"
  )

  await websocket.send_text(json.dumps(websocket_send))
