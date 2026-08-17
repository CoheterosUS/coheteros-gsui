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
        label: 'SYNC',
        value: (data: WebsocketTelemetryData) => `0x${data.sync.toString(16).toUpperCase().padStart(4, '0')}`
      },
      {
        label: 'TICK',
        value: (data: WebsocketTelemetryData) => data.tick
      },
      {
        label: 'STATE',
        value: (data: WebsocketTelemetryData) => data.state
      },
      {
        label: 'FLAGS',
        value: (data: WebsocketTelemetryData) => data.flags
      },
      {
        label: 'SYNC END',
        value: (data: WebsocketTelemetryData) => `0x${data.syncEnd.toString(16).toUpperCase().padStart(2, '0')}`
      }
    ]
  },
  {
    name: 'ALTITUDE',
    className: 'text-altitude',
    fields: [
      {
        label: 'ALTITUDE',
        value: (data: WebsocketTelemetryData) => data.altitude.toFixed(2),
        unit: 'm'
      },
      {
        label: 'VELOCITY X',
        value: (data: WebsocketTelemetryData) => data.velX.toFixed(2),
        unit: 'm/s'
      },
      {
        label: 'VELOCITY Y',
        value: (data: WebsocketTelemetryData) => data.velY.toFixed(2),
        unit: 'm/s'
      },
      {
        label: 'VELOCITY Z',
        value: (data: WebsocketTelemetryData) => data.velZ.toFixed(2),
        unit: 'm/s'
      }
    ]
  },
  {
    name: 'POSITION',
    className: 'text-position',
    fields: [
      {
        label: 'LATITUDE',
        value: (data: WebsocketTelemetryData) => (data.latitude / 1e7).toFixed(6),
        unit: '°'
      },
      {
        label: 'LONGITUDE',
        value: (data: WebsocketTelemetryData) => (data.longitude / 1e7).toFixed(6),
        unit: '°'
      }
    ]
  },
  {
    name: 'MAGNETOMETER',
    className: 'text-orientation',
    fields: [
      {
        label: 'MAGNETOMETER X',
        value: (data: WebsocketTelemetryData) => data.magX.toFixed(2),
      },
      {
        label: 'MAGNETOMETER Y',
        value: (data: WebsocketTelemetryData) => data.magY.toFixed(2),
      },
      {
        label: 'MAGNETOMETER Z',
        value: (data: WebsocketTelemetryData) => data.magZ.toFixed(2),
      }
    ]
  },
  {
    name: 'ACCELERATION',
    className: 'text-acceleration',
    fields: [
      {
        label: 'ACCELERATION X',
        value: (data: WebsocketTelemetryData) => data.accelX.toFixed(2),
        unit: 'm/s²'
      },
      {
        label: 'ACCELERATION Y',
        value: (data: WebsocketTelemetryData) => data.accelY.toFixed(2),
        unit: 'm/s²'
      },
      {
        label: 'ACCELERATION Z',
        value: (data: WebsocketTelemetryData) => data.accelZ.toFixed(2),
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
        value: (data: WebsocketTelemetryData) => data.gyroX.toFixed(2),
        unit: '°/s'
      },
      {
        label: 'GYROSCOPE Y',
        value: (data: WebsocketTelemetryData) => data.gyroY.toFixed(2),
        unit: '°/s'
      },
      {
        label: 'GYROSCOPE Z',
        value: (data: WebsocketTelemetryData) => data.gyroZ.toFixed(2),
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

export function showToast (packet: WebsocketNotificationPacket) {
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
