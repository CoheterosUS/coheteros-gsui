import GPSMap from '@/components/map/gpsmap'
import TelemetryEmpty from '@/components/telemetry/telemetry-empty'
import { useWebsocketContext } from '@/contexts/WebsocketContext'
import { useEffect, useState } from 'react'

export default function MapPage () {
  const { subscribe } = useWebsocketContext()
  const [initial, setInitial] = useState<WebsocketTelemetryData | null>(null)

  useEffect(() => {
    const unsubscribe = subscribe((packet) => setInitial((prev) => prev == null ? packet : prev))
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
