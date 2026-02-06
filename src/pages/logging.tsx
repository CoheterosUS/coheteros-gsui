import { useEffect, useRef, useState } from 'react'
import { useWebsocketAPI } from '@/contexts/WebsocketContext'
import Logging from '@/components/logging/logging'
import TelemetryEmpty from '@/components/telemetry/telemetry-empty'
import { MAX_DATA_POINTS } from '@/utils/config'

export default function LoggingPage () {
  const { subscribe } = useWebsocketAPI()
  const [logs, setLogs] = useState<WebsocketTelemetryData[]>([])
  const bufferRef = useRef<WebsocketTelemetryData[]>([])

  useEffect(() => {
    const unsubscribe = subscribe((data) => {
      bufferRef.current.push(data)
    })

    return () => {
      unsubscribe()
    }
  }, [subscribe])

  useEffect(() => {
    // TODO: Implement refresh rate selection, settings
    const interval = setInterval(() => {
      if (bufferRef.current.length > 0) {
        const incoming = [...bufferRef.current]
        bufferRef.current = []

        setLogs((prev) => {
          const combined = [...prev, ...incoming]
          return combined.slice(-MAX_DATA_POINTS)
        })
      }
    }, 500)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return logs.length > 0 ? (
    <div
      className='h-full flex flex-col'
    >
      {
        logs.length >= MAX_DATA_POINTS && (
          <p
            className='p-4 text-xs text-primary-muted-foreground border-b border-primary-muted'
          >
            DISPLAYING LAST {MAX_DATA_POINTS} PACKETS
          </p>
        )
      }
      <Logging
        data={logs}
      />
    </div>
  ) : (
    <TelemetryEmpty />
  )
}
