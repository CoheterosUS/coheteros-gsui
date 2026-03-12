from dataclasses import dataclass

@dataclass
class StateSchema:
  serial_port: str
  serial_baudrate: int

  serial_available_ports: list[str]

  is_sending_fake_telemetry: bool
  is_recording_csv: bool
