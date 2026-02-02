import json

from ..utils.packet import get_packet

async def execute (websocket, data, state):
  print("DEPLOYING PARACHUTE")
  websocket_send = get_packet(
    "NOTIFICATION_PACKET",
    "DEPLOYED PARACHUTE"
  )

  await websocket.send_text(json.dumps(websocket_send))
