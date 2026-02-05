class StateManager:
  def __init__ (self):
    self.send_fake_telemetry: bool = False
    self.record_csv: bool = False
    self.input_port: str | None = None
    self.baudrate: str | None = None
