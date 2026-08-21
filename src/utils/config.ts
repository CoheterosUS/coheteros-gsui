// WebSocket
export const WEBSOCKET_PORT = import.meta.env.VITE_BACKEND_PORT ?? 8000
export const MAX_DATA_POINTS = import.meta.env.VITE_MAX_DATA_POINTS ?? 50
export const RECONNECT_INTERVAL = import.meta.env.VITE_WS_RECONNECT_INTERVAL ?? 5000
export const WS_URL = `ws://localhost:${WEBSOCKET_PORT}/ws`
export const API_URL = `http://localhost:${WEBSOCKET_PORT}`

// Serial
export const DEFAULT_BAUDRATE = import.meta.env.VITE_DEFAULT_BAUDRATE ?? '115200'
export const BAUDRATE_OPTIONS = new Set<string>([
  DEFAULT_BAUDRATE,
  '9600',
  '19200',
  '38400',
  '57600',
  '115200'
])

// Testing
export const DEVELOPMENT_MODE = import.meta.env.VITE_MODE === 'TEST'

// Flight state machine, values come straight from the telemetry packet
export const STATE_IDLE = 0
export const STATE_GROUND_ABORT = 9

export const FLIGHT_STATES: Record<number, string> = {
  0: 'IDLE',
  1: 'CALIBRATION',
  2: 'PRELAUNCH',
  3: 'BURN',
  4: 'PASSIVE BURNOUT',
  5: 'ACTIVE BURNOUT',
  6: 'APOGEE',
  7: 'PARACHUTE',
  8: 'LANDED',
  9: 'GROUND ABORT',
  10: 'DESCENT ABORT'
}

// Relay/pyro bitmask, latching: set on fire, cleared on safe
export const RELAY_DROGUE = 0x01
export const RELAY_PARACHUTE = 0x02

// Visualizer
export const MODEL_PATH = '/model/rocket.obj'
export const SPHERE_RADIUS = 3
