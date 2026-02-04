import { Euler, MathUtils, Object3D } from 'three'
import { CircleCheck, CircleX, Info } from 'lucide-react'
import toast from 'react-hot-toast'

export const paddings = {
  gyroscope: 50,
  voltage: 0.5,
  temperature: 5
}

export const telemetryTableFields: TelemetryTableStructure[] = [
  {
    name: 'STATUS',
    className: 'text-status',
    fields: [
      {
        label: 'FSM STATE',
        value: (data: TelemetryData) => data.flightStatus
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
        value: (data: TelemetryData) => data.altitude.toFixed(2),
        unit: 'm'
      },
      {
        label: 'GPS ALTITUDE',
        value: (data: TelemetryData) => data.gpsAltitude.toFixed(2),
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
        value: (data: TelemetryData) => data.gpsLatitude.toFixed(6),
        unit: '°'
      },
      {
        label: 'GPS LONGITUDE',
        value: (data: TelemetryData) => data.gpsLongitude.toFixed(6),
        unit: '°'
      }
    ]
  },
  {
    name: 'ORIENTATION',
    className: 'text-orientation',
    fields: [
      {
        label: 'ROLL',
        value: (data: TelemetryData) => data.roll.toFixed(2),
        unit: '°'
      },
      {
        label: 'PITCH',
        value: (data: TelemetryData) => data.pitch.toFixed(2),
        unit: '°'
      },
      {
        label: 'YAW',
        value: (data: TelemetryData) => data.yaw.toFixed(2),
        unit: '°'
      }
    ]
  },
  {
    name: 'ACCELERATION',
    className: 'text-acceleration',
    fields: [
      {
        label: 'ACCELERATION X',
        value: (data: TelemetryData) => data.accelerationX.toFixed(2),
        unit: 'm/s²'
      },
      {
        label: 'ACCELERATION Y',
        value: (data: TelemetryData) => data.accelerationY.toFixed(2),
        unit: 'm/s²'
      },
      {
        label: 'ACCELERATION Z',
        value: (data: TelemetryData) => data.accelerationZ.toFixed(2),
        unit: 'm/s²'
      },
      {
        label: 'TOTAL ACCELERATION',
        value: (data: TelemetryData) => data.totalAcceleration.toFixed(2),
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
        value: (data: TelemetryData) => data.gyroscopeX.toFixed(2),
        unit: '°/s'
      },
      {
        label: 'GYROSCOPE Y',
        value: (data: TelemetryData) => data.gyroscopeY.toFixed(2),
        unit: '°/s'
      },
      {
        label: 'GYROSCOPE Z',
        value: (data: TelemetryData) => data.gyroscopeZ.toFixed(2),
        unit: '°/s'
      }
    ]
  }
]

export function getPaddedMinMax (
  data: TelemetryData[],
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
      const value = point[key as keyof TelemetryData]
      if (value < min) min = value
      if (value > max) max = value
    }
  }

  return {
    min: min - padding,
    max: max + padding
  }
}

export function getCenteredMesh (obj: Object3D) {
  if (obj == null) {
    return
  }

  obj.traverse((child: any) => {
    if (child.isMesh) {
      child.geometry.center()
    }
  })
}

export function getOrientation (roll: number, pitch: number, yaw: number) {
  return new Euler(
    MathUtils.degToRad(-pitch),
    MathUtils.degToRad(yaw),
    MathUtils.degToRad(roll),
    'YXZ'
  )
}

export function getCalculatedDataSize (event: MessageEvent) {
  let byteLength = 0

  if (typeof event.data === 'string') {
    byteLength = new TextEncoder().encode(event.data).length
  } else if (event.data instanceof Blob) {
    byteLength = event.data.size
  } else if (event.data instanceof ArrayBuffer) {
    byteLength = event.data.byteLength
  }

  return byteLength
}

export function getToastIcon (category: ToastCategory) {
  switch (category.toUpperCase()) {
    case 'SUCCESS':
      return CircleCheck
    case 'ERROR':
      return CircleX
    default:
      return Info
  }
}

export function getToastStyles (category: ToastCategory) {
  const Icon = getToastIcon(category)

  switch (category.toUpperCase()) {
    case 'SUCCESS':
      return {
        color: 'var(--color-positive)',
        border: '2px solid var(--color-positive)',
        Icon
      }
    case 'ERROR':
      return {
        color: 'var(--color-negative)',
        border: '2px solid var(--color-negative)',
        Icon
      }
    default:
      return {
        color: 'var(--color-primary-foreground)',
        border: '2px solid var(--color-primary-foreground)',
        Icon
      }
  }
}

export function showToast (packet: WebsocketPacket) {
  const { border, color } = getToastStyles(packet.category?.toUpperCase() as ToastCategory)

  switch (packet.category) {
    case 'SUCCESS':
      toast.success(packet.data, {
        style: {
          border,
          color
        }
      })
      break
    case 'ERROR':
      toast.error(packet.data, {
        style: {
          border,
          color
        }
      })
      break
    default:
      toast(packet.data, {
        style: {
          border,
          color
        }
      })
  }
}
