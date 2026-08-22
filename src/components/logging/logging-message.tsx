import { getStateName } from '@/utils/utils'

interface LoggingMessageProps {
  data: WebsocketTelemetryData
}

export default function LoggingMessage ({
  data
}: LoggingMessageProps) {
  const date = new Date(data.timestamp)
  const time = `${date.toLocaleTimeString('en-GB')}.${date.getMilliseconds().toString().padStart(3, '0')}`
  const raw = JSON.stringify(data)

  return (
    <div
      className='flex items-baseline gap-3 border-b border-primary px-3 py-1 text-xs odd:bg-primary/30 hover:bg-primary'
    >
      <span
        className='w-24 shrink-0 tabular-nums text-primary-muted-foreground'
      >
        {time}
      </span>
      <span
        className='w-20 shrink-0 tabular-nums text-altitude'
      >
        {data.tick}
      </span>
      <span
        className='w-32 shrink-0 truncate text-status'
      >
        {getStateName(data.state)}
      </span>
      <span
        title={raw}
        className='min-w-0 flex-1 truncate text-primary-muted-foreground'
      >
        {raw}
      </span>
    </div>
  )
}
