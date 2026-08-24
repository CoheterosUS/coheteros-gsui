import { Euler, MathUtils, Object3D } from 'three'
import { CircleCheck, CircleX, Info } from 'lucide-react'
import toast from 'react-hot-toast'
import { FAULT_DEVICES, FAULT_FLAGS, FLIGHT_STATES, LAST_COMMANDS, RELAY_DROGUE, RELAY_PARACHUTE } from '@/utils/config'

export function getStateName (state: number) {
  return FLIGHT_STATES[state] ?? `UNKNOWN (${state})`
}

export function getLastCommandName (command: number) {
  return LAST_COMMANDS[command] ?? `UNKNOWN (0x${command.toString(16).padStart(2, '0')})`
}

// visual severity of the flight state, used by the dashboard status strip
export function getStateStyle (state: number) {
  switch (state) {
    case 0:
      return 'border-primary-muted text-primary-muted-foreground'
    case 1:
    case 2:
      return 'border-warning text-warning'
    case 9:
    case 10:
      return 'border-negative text-negative'
    case 8:
      return 'border-positive text-positive'
    default:
      return 'border-status text-status'
  }
}

// a device is OK or it names the modes that failed, IDLE+PERF when both did
export function getFaultStatus (flags: number, device: string) {
  const failed = FAULT_FLAGS
    .filter((flag) => flag.device === device && (flags & (1 << flag.bit)))
    .map((flag) => flag.mode)

  return failed.length === 0 ? 'OK' : failed.join('+')
}

export function getFaultCount (flags: number) {
  return FAULT_FLAGS.filter((flag) => flags & (1 << flag.bit)).length
}

export const telemetryTableFields: TelemetryTableStructure[] = [
  {
    name: 'STATUS',
    className: 'text-status',
    accentClassName: 'bg-status',
    fields: [
      {
        label: 'TICK',
        value: (data: WebsocketTelemetryData) => data.tick
      },
      {
        label: 'STATE',
        value: (data: WebsocketTelemetryData) => getStateName(data.state)
      },
      {
        label: 'FLAGS',
        value: (data: WebsocketTelemetryData) => data.flags
      },
      {
        label: 'LAST COMMAND',
        value: (data: WebsocketTelemetryData) => getLastCommandName(data.lastCommand)
      },
      {
        label: 'DROGUE',
        value: (data: WebsocketTelemetryData) => (data.relayState & RELAY_DROGUE) ? 'FIRED' : 'SAFE',
        getClassName: (value: string | number) => value === 'FIRED' ? 'text-negative' : 'text-primary-foreground'
      },
      {
        label: 'PARACHUTE',
        value: (data: WebsocketTelemetryData) => (data.relayState & RELAY_PARACHUTE) ? 'FIRED' : 'SAFE',
        getClassName: (value: string | number) => value === 'FIRED' ? 'text-negative' : 'text-primary-foreground'
      }
    ]
  },
  {
    name: 'ALTITUDE',
    className: 'text-altitude',
    accentClassName: 'bg-altitude',
    fields: [
      {
        label: 'BAROMETRIC ALTITUDE (AGL)',
        value: (data: WebsocketTelemetryData) => data.barometricAltitude.toFixed(2),
        unit: 'm'
      },
      {
        label: 'BAROMETRIC VELOCITY',
        value: (data: WebsocketTelemetryData) => data.barometricVelocity.toFixed(2),
        unit: 'm/s'
      }
    ]
  },
  {
    name: 'VELOCITY',
    className: 'text-altitude',
    accentClassName: 'bg-altitude',
    fields: [
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
    accentClassName: 'bg-position',
    fields: [
      {
        label: 'GPS ALTITUDE (ASL)',
        value: (data: WebsocketTelemetryData) => data.gpsAltitude.toFixed(2),
        unit: 'm'
      },
      {
        label: 'LATITUDE',
        value: (data: WebsocketTelemetryData) => (data.latitude / 1e7).toFixed(6),
        unit: '°'
      },
      {
        label: 'LONGITUDE',
        value: (data: WebsocketTelemetryData) => (data.longitude / 1e7).toFixed(6),
        unit: '°'
      },
      {
        label: 'SATELLITES',
        value: (data: WebsocketTelemetryData) => data.satellites
      }
    ]
  },
  {
    name: 'FAULTS',
    className: 'text-negative',
    accentClassName: 'bg-negative',
    fields: FAULT_DEVICES.map((device) => ({
      label: device,
      value: (data: WebsocketTelemetryData) => getFaultStatus(data.flags, device),
      getClassName: (value: string | number) => value === 'OK' ? 'text-positive' : 'text-negative'
    }))
  },
  {
    name: 'MAGNETOMETER',
    className: 'text-orientation',
    accentClassName: 'bg-orientation',
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
    accentClassName: 'bg-acceleration',
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
    accentClassName: 'bg-gyroscope',
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

const EARTH_RADIUS_M = 6371000

// great-circle distance between two WGS84 points, in meters
export function getDistanceMeters (
  latitudeA: number,
  longitudeA: number,
  latitudeB: number,
  longitudeB: number
) {
  const phiA = MathUtils.degToRad(latitudeA)
  const phiB = MathUtils.degToRad(latitudeB)
  const deltaPhi = MathUtils.degToRad(latitudeB - latitudeA)
  const deltaLambda = MathUtils.degToRad(longitudeB - longitudeA)

  const a = Math.sin(deltaPhi / 2) ** 2 +
    Math.cos(phiA) * Math.cos(phiB) * Math.sin(deltaLambda / 2) ** 2

  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(a))
}

export function getDistanceLabel (meters: number) {
  return meters < 1000
    ? { value: meters.toFixed(0), unit: 'm' }
    : { value: (meters / 1000).toFixed(2), unit: 'km' }
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
