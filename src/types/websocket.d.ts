type WebsocketStatus =
  | 'disconnected'
  | 'connected'
  | 'reconnecting'

type WebsocketPacketType =
  | 'TELEMETRY_PACKET'
  | 'NOTIFICATION_PACKET'
  | 'STATE_UPDATE_PACKET'

type WebsocketCommandType =
  | 'DEPLOY_PARACHUTE'
  | 'START_FAKE_TELEMETRY'
  | 'STOP_FAKE_TELEMETRY'
  | 'START_CSV_RECORD'
  | 'STOP_CSV_RECORD'
  | 'CONNECT_SERIAL'
  | 'DISCONNECT_SERIAL'

interface WebsocketTelemetryData {
  timestamp: number
  ground_timestamp: number
  flightStatus: number
  altitude: number
  accelerationX: number
  accelerationY: number
  accelerationZ: number
  totalAcceleration: number
  gyroscopeX: number
  gyroscopeY: number
  gyroscopeZ: number
  magnetometerX: number
  magnetometerY: number
  magnetometerZ: number
  gpsLatitude: number
  gpsLongitude: number
  temperature: number
  pressure: number
  velocityZ: number
}

interface WebsocketNotificationPacket {
  data: string
  category?: ToastCategory
}

interface WebsocketStateUpdateData {
  serial_port: string | null
  serial_baudrate: number | null
  serial_available_ports: string[]
  is_sending_fake_telemetry: boolean
  is_recording_csv: boolean
}

type WebsocketPacketDataMap = {
  'TELEMETRY_PACKET': WebsocketTelemetryData
  'NOTIFICATION_PACKET': string
  'STATE_UPDATE_PACKET': WebsocketStateUpdateData
}

type WebsocketPacketCallback<T extends WebsocketPacketType = WebsocketPacketType> = (data: WebsocketPacketDataMap[T]) => void

interface WebsocketContextType {
  subscribe: <T extends WebsocketPacketType>(
    type: T,
    callback: WebsocketPacketCallback<T>
  ) => () => void
  status: WebsocketStatus
  rate: number
  pps: number
  send: (command: WebsocketCommand) => void
  reconnect: () => void
}

interface WebsocketCommand {
  type: WebsocketCommandType
  data?: string
}
