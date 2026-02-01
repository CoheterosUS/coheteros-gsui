export const paddings = {
  gyroscope: 50,
  voltage: 0.5,
  temperature: 5
}

export const telemetryTableFields: TelemetryTableStructure[] = [
  {
    name: 'ACCELERATION',
    className: 'text-acceleration',
    fields: [
      {
        label: 'ACCELERATION X',
        value: (data: TelemetryPacket) => data.accelerationX.toFixed(2),
        unit: 'm/s²'
      },
      {
        label: 'ACCELERATION Y',
        value: (data: TelemetryPacket) => data.accelerationY.toFixed(2),
        unit: 'm/s²'
      },
      {
        label: 'ACCELERATION Z',
        value: (data: TelemetryPacket) => data.accelerationZ.toFixed(2),
        unit: 'm/s²'
      },
      {
        label: 'TOTAL ACCELERATION',
        value: (data: TelemetryPacket) => data.totalAcceleration.toFixed(2),
        unit: 'm/s²'
      }
    ]
  },
  {
    name: 'GYROSCOPE',
    className: 'text-gyroscope',
    fields: [
      {
        label: 'GYROSCOPE X',
        value: (data: TelemetryPacket) => data.gyroscopeX.toFixed(2),
        unit: '°/s'
      },
      {
        label: 'GYROSCOPE Y',
        value: (data: TelemetryPacket) => data.gyroscopeY.toFixed(2),
        unit: '°/s'
      },
      {
        label: 'GYROSCOPE Z',
        value: (data: TelemetryPacket) => data.gyroscopeZ.toFixed(2),
        unit: '°/s'
      }
    ]
  },
  {
    name: 'STATUS',
    className: 'text-status',
    fields: [
      {
        label: 'FSM STATE',
        value: (data: TelemetryPacket) => data.flightStatus
      },
      {
        label: 'DROGUE',
        value: () => 'DEPLOYED'
      },
      {
        label: 'MAIN',
        value: () => 'NOT DEPLOYED'
      }
    ]
  },
  {
    name: 'ALTITUDE',
    className: 'text-altitude',
    fields: [
      {
        label: 'BAROMETRIC ALTITUDE',
        value: (data: TelemetryPacket) => data.altitude.toFixed(2),
        unit: 'm'
      },
      {
        label: 'GPS ALTITUDE',
        value: (data: TelemetryPacket) => data.gpsAltitude.toFixed(2),
        unit: 'm'
      }
    ]
  },
  {
    name: 'POSITION',
    className: 'text-position',
    fields: [
      {
        label: 'GPS LATITUDE',
        value: (data: TelemetryPacket) => data.gpsLatitude.toFixed(6),
        unit: '°'
      },
      {
        label: 'GPS LONGITUDE',
        value: (data: TelemetryPacket) => data.gpsLongitude.toFixed(6),
        unit: '°'
      }
    ]
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
