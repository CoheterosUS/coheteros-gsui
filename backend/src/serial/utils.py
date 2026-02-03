from serial.tools import list_ports

def get_serial_ports ():
  ports = list_ports.comports()
  return [
    {"name": port.device, "description": port.description}
    for port in ports
  ]
