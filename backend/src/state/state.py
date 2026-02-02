class WebsocketState:
  def __init__ (self):
    self.send_fake_packets: bool = True
    self.input_port: str | None = None
    self.output_port: str | None = None
