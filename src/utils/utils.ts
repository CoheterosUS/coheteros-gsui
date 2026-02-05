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
        value: (data: WebsocketTelemetryData) => data.flightStatus
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
        value: (data: WebsocketTelemetryData) => data.altitude.toFixed(2),
        unit: 'm'
      },
      {
        label: 'GPS ALTITUDE',
        value: (data: WebsocketTelemetryData) => data.gpsAltitude.toFixed(2),
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
        value: (data: WebsocketTelemetryData) => data.gpsLatitude.toFixed(6),
        unit: '°'
      },
      {
        label: 'GPS LONGITUDE',
        value: (data: WebsocketTelemetryData) => data.gpsLongitude.toFixed(6),
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
        value: (data: WebsocketTelemetryData) => data.roll.toFixed(2),
        unit: '°'
      },
      {
        label: 'PITCH',
        value: (data: WebsocketTelemetryData) => data.pitch.toFixed(2),
        unit: '°'
      },
      {
        label: 'YAW',
        value: (data: WebsocketTelemetryData) => data.yaw.toFixed(2),
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
        value: (data: WebsocketTelemetryData) => data.accelerationX.toFixed(2),
        unit: 'm/s²'
      },
      {
        label: 'ACCELERATION Y',
        value: (data: WebsocketTelemetryData) => data.accelerationY.toFixed(2),
        unit: 'm/s²'
      },
      {
        label: 'ACCELERATION Z',
        value: (data: WebsocketTelemetryData) => data.accelerationZ.toFixed(2),
        unit: 'm/s²'
      },
      {
        label: 'TOTAL ACCELERATION',
        value: (data: WebsocketTelemetryData) => data.totalAcceleration.toFixed(2),
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
        value: (data: WebsocketTelemetryData) => data.gyroscopeX.toFixed(2),
        unit: '°/s'
      },
      {
        label: 'GYROSCOPE Y',
        value: (data: WebsocketTelemetryData) => data.gyroscopeY.toFixed(2),
        unit: '°/s'
      },
      {
        label: 'GYROSCOPE Z',
        value: (data: WebsocketTelemetryData) => data.gyroscopeZ.toFixed(2),
        unit: '°/s'
      }
    ]
  }
]

export function getPaddedMinMax (
  data: WebsocketTelemetryData[],
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
      const value = point[key as keyof WebsocketTelemetryData]
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
      return {
        styles: 'text-toast-success',
        Icon: CircleCheck
      }
    case 'ERROR':
      return {
        styles: 'text-toast-error',
        Icon: CircleX
      }
    default:
      return {
        styles: 'text-primary-foreground',
        Icon: Info
      }
  }
}

export function showToast (packet: WebsocketPacket) {
  switch (packet.category?.toUpperCase()) {
    case 'SUCCESS':
      toast.success(packet.data)
      break
    case 'ERROR':
      toast.error(packet.data)
      break
    default:
      toast(packet.data)
      break
  }
}
