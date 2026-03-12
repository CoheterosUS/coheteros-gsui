import { useEffect, useState } from 'react'
import GPSMap from '@/components/map/gpsmap'
import TelemetryEmpty from '@/components/telemetry/telemetry-empty'
import { useWebsocketAPI } from '@/contexts/WebsocketContext'

export default function MapPage () {
  const { subscribe } = useWebsocketAPI()
  const [initial, setInitial] = useState<WebsocketTelemetryData | null>(null)

  useEffect(() => {
    const unsubscribe = subscribe('TELEMETRY_PACKET', (packet) => setInitial((prev) => prev == null ? packet : prev))
    return () => {
      unsubscribe()
    }
  }, [subscribe])

  return initial == null ? (
    <TelemetryEmpty />
  ) : (
    <div
      className='h-full flex flex-col justify-center items-center gap-6'
    >
      <GPSMap
        initial={initial}
      />
    </div>
  )
}
