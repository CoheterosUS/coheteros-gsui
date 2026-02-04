type WebsocketPacketType =
  | 'TELEMETRY_PACKET'
  | 'NOTIFICATION_PACKET'

interface WebsocketPacket {
  type: WebsocketPacketType
  data: any
  category?: ToastCategory
}

interface TelemetryData {
  timestamp: number
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

interface ChartComponentProps {
  data: TelemetryData[]
}

interface TelemetryTableStructure {
  name: string
  className: string
  fields: TelemetryTableStructureField[]
}

interface TelemetryTableStructureField {
  label: string
  value: (data: TelemetryData) => string | number
  unit?: string
  className?: string
}

interface TelemetryTableFieldProps {
  label: string
  value: string | number
  unit?: string
  className?: string
}

interface ControlsResponse {
  ports: {
    port_in_use?: SerialPort
    available_ports: SerialPort[]
  }
  fake_telemetry_enabled: boolean
}

interface SerialPort {
  name: string
  description?: string
  baudrate: string
}

interface Command {
  type: string
  data?: string
}

type WebsocketStatus = 'disconnected' | 'connected' | 'reconnecting'

interface WebsocketContextType {
  data: TelemetryData[]
  status: WebsocketStatus
  rate: number
  pps: number
  send: (command: Command) => void
  reconnect: () => void
}

type ToastCategory = 'INFO' | 'SUCCESS' | 'ERROR'
