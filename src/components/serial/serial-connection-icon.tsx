import { CircleCheck, CircleSlash, LoaderCircle } from 'lucide-react'

interface SerialConnectionIconProps {
  status: WebsocketStatus
  port: number
}

export default function SerialConnectionIcon ({
  status,
  port
}: SerialConnectionIconProps) {
  const statusStyle = status === 'connected'
    ? 'text-positive'
    : status === 'reconnecting'
      ? 'text-warning'
      : 'text-negative'

  const iconStyle = `size-3.5 ${statusStyle}`

  return (
    <p
      title={status.toUpperCase()}
      className='flex items-center gap-2'
    >
      <span
        className='text-[10px] tracking-widest text-primary-muted-foreground'
      >
        {status === 'connected' ? 'LINK' : status.toUpperCase()}
      </span>
      <span
        className={`text-xs tabular-nums ${statusStyle}`}
      >
        :{port}
      </span>
      {
        status === 'connected' ? (
          <CircleCheck
            className={iconStyle}
          />
        ) : (
          status === 'reconnecting' ? (
            <LoaderCircle
              className={`${iconStyle} animate-spin`}
            />
          ) : (
            <CircleSlash
              className={iconStyle}
            />
          )
        )
      }
    </p>
  )
}
