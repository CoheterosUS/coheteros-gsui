from ...state.state_manager import global_state

async def execute (data: dict) -> None:
  global_state.update("is_sending_fake_telemetry", False)
  await global_state.broadcast_state()
  await global_state.broadcast_notification("FAKE TELEMETRY STOPPED")
