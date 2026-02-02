import SerialConnectionIcon from '@/components/serial/serial-connection-icon'
import SerialStatusIcon from '@/components/serial/serial-status-icon'
import SerialPacketsIcon from '@/components/serial/serial-packets-icon'
import { WEBSOCKET_PORT } from '@/utils/utils'

interface SerialStatusProps {
  status: string
  downlink: number
  uplink: number
  pps: number
}

export default function SerialStatus ({
  status,
  downlink,
  uplink,
  pps
}: SerialStatusProps) {
  return (
    <div
      className='fixed bottom-0 left-0 w-full h-6 flex items-center justify-between px-2 py-1 bg-primary'
    >
      <div
        className='flex gap-2'
      >
        {
          [downlink, uplink].map((rate, index) => (
            <SerialStatusIcon
              key={index}
              direction={index === 0 ? 'down' : 'up'}
              rate={rate}
            />
          ))
        }
        <SerialPacketsIcon
          pps={pps}
        />
      </div>
      <SerialConnectionIcon
        status={status}
        port={WEBSOCKET_PORT}
      />
    </div>
  )
}
