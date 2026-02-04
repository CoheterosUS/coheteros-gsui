from serial.tools import list_ports

from ..state.state import WebsocketState

def get_controls_status (state: WebsocketState):
  ports = list_ports.comports()
  port_in_use = None if state.input_port is None else {
    "name": state.input_port,
    "baudrate": state.baudrate
  }

  available_ports = [
    {"name": port.device, "description": port.description}
    for port in ports
  ]

  return {
    "ports": {
      "port_in_use": port_in_use,
      "available_ports": available_ports
    },
    "fake_telemetry_enabled": state.send_fake_telemetry
  }

def get_packet (type: str, data: dict, category: str | None = "INFO"):
  packet = {
    "type": type,
    "data": data,
    "category": category
  }

  return packet
