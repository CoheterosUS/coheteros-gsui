type WebsocketStatus =
  | 'disconnected'
  | 'connected'
  | 'reconnecting'

type WebsocketPacketType =
  | 'TELEMETRY_PACKET'
  | 'NOTIFICATION_PACKET'

interface WebsocketContextType {
  subscribe: (callback: (data: WebsocketTelemetryData) => void) => () => void
  status: WebsocketStatus
  rate: number
  pps: number
  send: (command: WebsocketCommand) => void
  reconnect: () => void
}

interface WebsocketCommand {
  type: string
  data?: string
}

interface WebsocketPacket {
  type: WebsocketPacketType
  data: any
  category?: ToastCategory
}

interface WebsocketTelemetryData {
  timestamp: number
  ground_timestamp: number
  altitude: number
  gpsAltitude: number
  flightStatus: number
  accelerationX: number
  accelerationY: number
  accelerationZ: number
  totalAcceleration: number
  gyroscopeX: number
  gyroscopeY: number
  gyroscopeZ: number
  roll: number
  pitch: number
  yaw: number
  gpsLatitude: number
  gpsLongitude: number
  payloadAltitude: number
  payloadLatitude: number
  payloadLongitude: number
  batteryVoltage: number
  temperature: number
}
