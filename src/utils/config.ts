// WebSocket
export const WEBSOCKET_PORT = import.meta.env.VITE_WS_PORT ?? 8000
export const MAX_DATA_POINTS = 50
export const RECONNECT_INTERVAL = 5000
export const WS_URL = `ws://localhost:${WEBSOCKET_PORT}/ws`
export const API_URL = `http://localhost:${WEBSOCKET_PORT}`

// Visualizer
export const MODEL_PATH = '/model/rocket.obj'
export const SPHERE_RADIUS = 3
