import asyncio
import threading
import webview

from os import getenv
from dotenv import load_dotenv
from main import start_server

load_dotenv()

VITE_MODE = getenv("VITE_MODE", "TEST")

def _run_backend ():
  asyncio.run(start_server())

def main ():
  if VITE_MODE == "PROD":
    print("RUNNING IN PRODUCTION MODE")

    backend_thread = threading.Thread(target=_run_backend, daemon=True)
    backend_thread.start()

    webview.create_window(
      "Coheteros US Ground Station",
      url="http://localhost:8000",
      maximized=True,
      min_size=(1200, 800),
    )

    webview.start()
  else:
    print("RUNNING IN TEST MODE")
    _run_backend()

if __name__ == "__main__":
  main()
