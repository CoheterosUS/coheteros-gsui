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
