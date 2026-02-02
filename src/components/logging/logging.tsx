import { useEffect, useRef } from 'react'
import LoggingMessage from '@/components/logging/logging-message'

interface LoggingProps {
  data: TelemetryPacket[]
}

export default function Logging ({
  data
}: LoggingProps) {
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (listRef.current == null) {
      return
    }

    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [data])

  return (
    <div
      className='flex-1 overflow-auto'
    >
      <div
        ref={listRef}
        className='w-full h-full flex flex-col gap-2 p-2 overflow-auto bg-background'
      >
        {
          data.map((packet, index) => (
            <LoggingMessage
              key={index}
              packet={packet}
            />
          ))
        }
      </div>
    </div>
  )
}
