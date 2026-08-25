from ..utils.logger import logger

from .commands import start_fake_telemetry
from .commands import stop_fake_telemetry
from .commands import connect_serial
from .commands import disconnect_serial
from .commands import start_csv_record
from .commands import stop_csv_record
from .commands import send_flight_command

COMMAND_MAP = {
  "RESET": send_flight_command.execute_reset,
  "GROUND_ABORT": send_flight_command.execute_ground_abort,
  "CALIBRATION": send_flight_command.execute_calibration,
  "DROGUE": send_flight_command.execute_drogue,
  "LANDED": send_flight_command.execute_landed,
  "START_FAKE_TELEMETRY": start_fake_telemetry.execute,
  "STOP_FAKE_TELEMETRY": stop_fake_telemetry.execute,
  "CONNECT_SERIAL": connect_serial.execute,
  "DISCONNECT_SERIAL": disconnect_serial.execute,
  "START_CSV_RECORD": start_csv_record.execute,
  "STOP_CSV_RECORD": stop_csv_record.execute
}

async def command_dispatch (cmd_name: str, data: dict) -> None:
  if cmd_name in COMMAND_MAP:
    logger(f"DISPATCHING COMMAND: {cmd_name}")
    await COMMAND_MAP[cmd_name](data)
  else:
    logger(f"UNKNOWN COMMAND: {cmd_name}", "WARNING")
