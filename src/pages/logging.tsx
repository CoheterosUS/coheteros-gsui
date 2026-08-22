import { useEffect, useRef, useState } from 'react'
import { useWebsocketAPI } from '@/contexts/WebsocketContext'
import Logging from '@/components/logging/logging'
import TelemetryEmpty from '@/components/telemetry/telemetry-empty'
import ControlsButton from '@/components/controls/controls-button'
import Panel from '@/components/ui/panel'
import { MAX_DATA_POINTS } from '@/utils/config'

export default function LoggingPage () {
  const { subscribe } = useWebsocketAPI()
  const [logs, setLogs] = useState<WebsocketTelemetryData[]>([])
  const [autoScroll, setAutoScroll] = useState(true)
  const bufferRef = useRef<WebsocketTelemetryData[]>([])

  useEffect(() => {
    const unsubscribe = subscribe('TELEMETRY_PACKET', (data) => {
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

  const handleClear = () => {
    bufferRef.current = []
    setLogs([])
  }

  const actions = (
    <div
      className='flex items-center gap-2'
    >
      <span
        className='text-[10px] tracking-widest text-primary-muted-foreground'
      >
        {logs.length} / {MAX_DATA_POINTS} PACKETS
      </span>
      <ControlsButton
        label={autoScroll ? 'FOLLOWING' : 'PAUSED'}
        active={autoScroll}
        onClick={() => setAutoScroll((prev) => !prev)}
      />
      <ControlsButton
        label='CLEAR'
        variant='danger'
        onClick={handleClear}
        disabled={logs.length === 0}
      />
    </div>
  )

  return (
    <div
      className='h-full flex flex-col p-2'
    >
      <Panel
        title='PACKET LOG'
        accentClassName='text-status'
        className='flex-1'
        actions={actions}
      >
        {
          logs.length > 0 ? (
            <Logging
              data={logs}
              autoScroll={autoScroll}
            />
          ) : (
            <TelemetryEmpty />
          )
        }
      </Panel>
    </div>
  )
}
