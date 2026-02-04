// WebSocket
export const WEBSOCKET_PORT = import.meta.env.VITE_BACKEND_PORT ?? 8000
export const MAX_DATA_POINTS = import.meta.env.VITE_MAX_DATA_POINTS ?? 50
export const RECONNECT_INTERVAL = import.meta.env.VITE_WS_RECONNECT_INTERVAL ?? 5000
export const WS_URL = `ws://localhost:${WEBSOCKET_PORT}/ws`
export const API_URL = `http://localhost:${WEBSOCKET_PORT}`

// Serial
export const DEFAULT_BAUDRATE = import.meta.env.VITE_DEFAULT_BAUDRATE ?? '9600'
export const BAUDRATE_OPTIONS = new Set<string>([
  DEFAULT_BAUDRATE,
  '9600',
  '19200',
  '38400',
  '57600',
  '115200'
])

// Testing
export const ALLOW_FAKE_PACKETS = import.meta.env.VITE_MODE === 'TEST'

// Visualizer
export const MODEL_PATH = '/model/rocket.obj'
export const SPHERE_RADIUS = 3
