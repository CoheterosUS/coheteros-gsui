import { useEffect, useRef, useState } from 'react'
import TelemetryContainer from './telemetry-container'
import { useWebsocketContext } from '@/contexts/WebsocketContext'

export default function Telemetry () {
  const { subscribe } = useWebsocketContext()
  const [data, setData] = useState<WebsocketTelemetryData | null>(null)
  const lastUpdateRef = useRef<number>(0)

  useEffect(() => {
    const unsubscribe = subscribe((data) => {
      const now = Date.now()
      // TODO: Implement refresh rate selection, settings
      if (now - lastUpdateRef.current > 200) {
        setData(data)
        lastUpdateRef.current = now
      }
    })

    return () => {
      unsubscribe()
    }
  }, [subscribe])

  return data && (
    <TelemetryContainer
      data={data}
    />
  )
}
