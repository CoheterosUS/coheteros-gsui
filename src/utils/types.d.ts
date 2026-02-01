interface TelemetryPacket {
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
  data: TelemetryPacket[]
}

interface TelemetryTableStructure {
  name: string
  className: string
  fields: TelemetryTableStructureField[]
}

interface TelemetryTableStructureField {
  label: string
  value: (data: TelemetryPacket) => string | number
  unit?: string
  className?: string
}

interface TelemetryTableFieldProps {
  label: string
  value: string | number
  unit?: string
  className?: string
}
