import json

from ...state.state_manager import global_state
from ...serial.serial_manager import global_serial

async def execute (data: dict) -> None:
  parsed_data = json.loads(data)
  port = parsed_data.get("input_port")
  baudrate = int(parsed_data.get("baudrate"))

  if not port or not baudrate:
    return

  global_serial.disconnect()
  global_state.update("is_sending_fake_telemetry", False)

  result = global_serial.connect(port, baudrate)
  if result:
    global_state.update("serial_port", port)
    global_state.update("serial_baudrate", baudrate)
    global_serial.start_reading()

  await global_state.broadcast_state()
  await global_state.broadcast_notification(
    f"SERIAL CONNECTION {'ESTABLISHED' if result else 'FAILED'}: {port} @ {baudrate} BAUDRATE",
    "SUCCESS" if result else "ERROR"
  )
