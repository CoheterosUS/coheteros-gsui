from serial.tools import list_ports

from ..state.state import WebsocketState

def get_serial_ports (state: WebsocketState):
  ports = list_ports.comports()
  port_in_use = None if state.input_port is None else {
    "name": state.input_port,
    "baudrate": state.baudrate
  }

  return {
    "port_in_use": port_in_use,
    "available_ports": [
      {"name": port.device, "description": port.description}
      for port in ports
    ]
  }
