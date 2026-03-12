from ...state.state_manager import global_state
from ...csv.csv_manager import global_csv

async def execute (data: dict) -> None:
  global_state.update("is_recording_csv", False)

  global_csv.stop()

  await global_state.broadcast_state()
  await global_state.broadcast_notification("CSV RECORDING STOPPED")
