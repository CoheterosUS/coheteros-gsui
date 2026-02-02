import { useEffect, useRef } from 'react'
import LoggingMessage from '@/components/logging/logging-message'

interface LoggingProps {
  data: TelemetryData[]
}

export default function Logging ({
  data
}: LoggingProps) {
  const logsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (logsRef.current == null) {
      return
    }

    logsRef.current.scrollTop = logsRef.current.scrollHeight
  }, [])

  return (
    <div
      ref={logsRef}
      className='h-full flex flex-col gap-4 p-4 bg-background overflow-y-auto'
    >
      {
        data.map((single, index) => (
          <LoggingMessage
            key={index}
            data={single}
          />
        ))
      }
    </div>
  )
}
