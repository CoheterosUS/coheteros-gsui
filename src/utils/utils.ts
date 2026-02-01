export const paddings = {
  gyroscope: 50,
  voltage: 0.5,
  temperature: 5
}

export const telemetryFields = [
  {
    label: 'Timestamp',
    value: (data: TelemetryPacket) => data.timestamp.toFixed(2)
  },
  {
    label: 'Altitude (m)',
    value: (data: TelemetryPacket) => data.altitude.toFixed(2)
  },
  {
    label: 'GPS Altitude (m)',
    value: (data: TelemetryPacket) => data.gpsAltitude.toFixed(2)
  },
  {
    label: 'Flight Status',
    value: (data: TelemetryPacket) => data.flightStatus
  },
  {
    label: 'Acceleration X (m/s²)',
    value: (data: TelemetryPacket) => data.accelerationX.toFixed(2)
  },
  {
    label: 'Acceleration Y (m/s²)',
    value: (data: TelemetryPacket) => data.accelerationY.toFixed(2)
  },
  {
    label: 'Acceleration Z (m/s²)',
    value: (data: TelemetryPacket) => data.accelerationZ.toFixed(2)
  },
  {
    label: 'Total Acceleration (m/s²)',
    value: (data: TelemetryPacket) => data.totalAcceleration.toFixed(2)
  },
  {
    label: 'Gyroscope X (°/s)',
    value: (data: TelemetryPacket) => data.gyroscopeX.toFixed(2)
  },
  {
    label: 'Gyroscope Y (°/s)',
    value: (data: TelemetryPacket) => data.gyroscopeY.toFixed(2)
  },
  {
    label: 'Gyroscope Z (°/s)',
    value: (data: TelemetryPacket) => data.gyroscopeZ.toFixed(2)
  },
  {
    label: 'Roll (°)',
    value: (data: TelemetryPacket) => data.roll.toFixed(2)
  },
  {
    label: 'Pitch (°)',
    value: (data: TelemetryPacket) => data.pitch.toFixed(2)
  },
  {
    label: 'Yaw (°)',
    value: (data: TelemetryPacket) => data.yaw.toFixed(2)
  },
  {
    label: 'GPS Latitude (°)',
    value: (data: TelemetryPacket) => data.gpsLatitude.toFixed(2)
  },
  {
    label: 'GPS Longitude (°)',
    value: (data: TelemetryPacket) => data.gpsLongitude.toFixed(2)
  },
  {
    label: 'Battery Voltage (V)',
    value: (data: TelemetryPacket) => data.batteryVoltage.toFixed(2)
  },
  {
    label: 'Temperature (°C)',
    value: (data: TelemetryPacket) => data.temperature.toFixed(2)
  }
]

export function getPaddedMinMax (
  data: TelemetryPacket[],
  keys: string[],
  padding = 0
) {
  if (data.length === 0) {
    return {
      min: 0,
      max: 0
    }
  }

  let min = Infinity
  let max = -Infinity

  for (const point of data) {
    for (const key of keys) {
      const value = point[key as keyof TelemetryPacket]
      if (value < min) min = value
      if (value > max) max = value
    }
  }

  return {
    min: min - padding,
    max: max + padding
  }
}

export function getFirstCapitalized (str: string) {
  if (str.length === 0) {
    return str
  }

  return str.charAt(0).toUpperCase() + str.slice(1)
}
