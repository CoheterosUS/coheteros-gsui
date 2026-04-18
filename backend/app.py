import asyncio
import threading
import webview

from os import getenv
from urllib.request import urlopen
from dotenv import load_dotenv
from main import start_server

load_dotenv()

VITE_MODE = getenv("VITE_MODE", "TEST")
BACKEND_HOST = getenv("BACKEND_HOST", "localhost")
BACKEND_PORT = int(getenv("VITE_BACKEND_PORT", 8000))
BACKEND_URL = f"http://{BACKEND_HOST}:{BACKEND_PORT}"

def _run_backend ():
  asyncio.run(start_server())

def _is_backend_running ():
  try:
    with urlopen(f"{BACKEND_URL}/api/status", timeout=0.5) as response:
      return response.status == 200
  except Exception:
    return False

def main ():
  if VITE_MODE == "PROD":
    print("RUNNING IN PRODUCTION MODE")

    if _is_backend_running():
      print(f"BACKEND ALREADY RUNNING AT {BACKEND_URL}, REUSING IT")
    else:
      print(f"BACKEND NOT DETECTED, STARTING NEW BACKEND AT {BACKEND_URL}")
      backend_thread = threading.Thread(target=_run_backend, daemon=True)
      backend_thread.start()

    webview.create_window(
      "Coheteros US Ground Station",
      url=BACKEND_URL,
      maximized=True,
      min_size=(1200, 800),
    )

    webview.start()
  else:
    print("RUNNING IN TEST MODE")
    _run_backend()

if __name__ == "__main__":
  main()
