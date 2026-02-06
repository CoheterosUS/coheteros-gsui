import { useWebsocketStats } from '@/contexts/WebsocketContext'
import SerialConnectionIcon from '@/components/serial/serial-connection-icon'
import SerialSpeedIcon from '@/components/serial/serial-speed-icon'
import SerialPacketsIcon from '@/components/serial/serial-packets-icon'
import { WEBSOCKET_PORT, DEVELOPMENT_MODE } from '@/utils/config'

export default function SerialStatus () {
  const { status, rate, pps } = useWebsocketStats()

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
      {
        DEVELOPMENT_MODE && (
          <p
            className='text-xs text-negative'
          >
            DEVELOPMENT BUILD
          </p>
        )
      }
      <SerialConnectionIcon
        status={status}
        port={WEBSOCKET_PORT}
      />
    </div>
  )
}
