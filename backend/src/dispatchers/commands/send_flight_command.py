from ...state.state_manager import global_state
from ...serial.serial_manager import global_serial

async def _send (command: str) -> None:
  result = global_serial.send_command(command)

  await global_state.broadcast_notification(
    f"COMMAND {command} {'SENT' if result else 'FAILED'}",
    "SUCCESS" if result else "ERROR"
  )

async def execute_reset (data: dict) -> None:
  await _send("RESET")

async def execute_ground_abort (data: dict) -> None:
  await _send("GROUND_ABORT")

async def execute_calibration (data: dict) -> None:
  await _send("CALIBRATION")

async def execute_drogue (data: dict) -> None:
  await _send("DROGUE")
