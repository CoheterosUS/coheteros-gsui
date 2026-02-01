import { CircleCheck, CircleSlash, LoaderCircle } from 'lucide-react'
import { getFirstCapitalized } from '@/utils/utils'

interface SerialConnectionIconProps {
  status: string
}

export default function SerialConnectionIcon ({
  status
}: SerialConnectionIconProps) {
  const iconStyle = `
    h-4 w-4
    ${status === 'connected' ? 'text-green-500' : status === 'reconnecting' ? 'text-yellow-500' : 'text-red-500'}
  `

  return (
    <p
      title={getFirstCapitalized(status)}
    >
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
