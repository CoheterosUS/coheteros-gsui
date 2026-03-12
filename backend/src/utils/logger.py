import logging

def logger (message: str, type: str = "INFO") -> None:
  if type == "WARNING":
    logging.getLogger("uvicorn").warning(message)
  elif type == "ERROR":
    logging.getLogger("uvicorn").error(message)
  else:
    logging.getLogger("uvicorn").info(message)
