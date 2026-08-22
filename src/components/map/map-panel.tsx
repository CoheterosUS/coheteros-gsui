import { useEffect, useState } from 'react'
import { useWebsocketAPI } from '@/contexts/WebsocketContext'
import GPSMap from '@/components/map/gpsmap'
import Panel from '@/components/ui/panel'

export default function MapPanel () {
  const { subscribe } = useWebsocketAPI()
  const [initial, setInitial] = useState<WebsocketTelemetryData | null>(null)

  // the map only needs a starting view, it follows the stream on its own
  useEffect(() => {
    const unsubscribe = subscribe('TELEMETRY_PACKET', (packet) => {
      setInitial((prev) => prev == null ? packet : prev)
    })

    return () => {
      unsubscribe()
    }
  }, [subscribe])

  return (
    <Panel
      title='MAP'
      accentClassName='text-position'
      className='h-full'
    >
      {
        initial == null ? (
          <div
            className='h-full grid place-items-center text-sm text-primary-muted-foreground'
          >
            NO GPS FIX YET
          </div>
        ) : (
          <GPSMap
            initial={initial}
          />
        )
      }
    </Panel>
  )
}
