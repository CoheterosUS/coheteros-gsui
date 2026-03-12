from serial.tools import list_ports

from ..utils.logger import logger

def get_available_serial_ports () -> list[str]:
  ports = [port.device for port in list_ports.comports()]
  logger(f"AVAILABLE SERIAL PORTS: {ports}")
  return ports
