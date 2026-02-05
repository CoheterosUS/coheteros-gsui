import SerialConnectionIcon from '@/components/serial/serial-connection-icon'
import SerialSpeedIcon from '@/components/serial/serial-speed-icon'
import SerialPacketsIcon from '@/components/serial/serial-packets-icon'
import { WEBSOCKET_PORT } from '@/utils/config'

interface SerialStatusProps {
  status: WebsocketStatus
  rate: number
  pps: number
}

export default function SerialStatus ({
  status,
  rate,
  pps
}: SerialStatusProps) {
  return (
    <div
      className='h-6 flex items-center justify-between px-2 py-1 bg-primary'
    >
      <div
        className='flex gap-2'
      >
        <SerialSpeedIcon
          status={status}
          rate={rate}
        />
        <SerialPacketsIcon
          status={status}
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
