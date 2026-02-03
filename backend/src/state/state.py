class WebsocketState:
  def __init__ (self):
    self.send_fake_telemetry: bool = True
    self.input_port: str | None = None
    self.baudrate: str | None = None

  def reset (self):
    self.send_fake_telemetry = False
    self.input_port = None
    self.baudrate = None
