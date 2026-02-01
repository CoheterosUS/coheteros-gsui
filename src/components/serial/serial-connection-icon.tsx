import { CircleCheck, CircleSlash, LoaderCircle } from 'lucide-react'

interface SerialConnectionIconProps {
  status: string
  port: number
}

export default function SerialConnectionIcon ({
  status,
  port
}: SerialConnectionIconProps) {
  const iconStyle = `
    h-4 w-4
    ${status === 'connected' ? 'text-green-500' : status === 'reconnecting' ? 'text-yellow-500' : 'text-red-500'}
  `

  return (
    <p
      title={status.toUpperCase()}
      className='flex items-center gap-2'
    >
      <span
        className='text-xs text-primary-muted-foreground'
      >
        {
          status === 'connected' ? (
            `:${port}`
          ) : (
            status.toUpperCase()
          )
        }
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
