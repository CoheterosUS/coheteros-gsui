from ...state.state_manager import global_state
from ...serial.serial_manager import global_serial
  
async def execute (data: dict) -> None:
  global_serial.disconnect()
  global_state.update("serial_port", None)
  global_state.update("serial_baudrate", None)

  await global_state.broadcast_state()
  await global_state.broadcast_notification("SERIAL CONNECTION CLOSED")
