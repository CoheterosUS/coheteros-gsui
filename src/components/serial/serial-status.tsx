import { useWebsocketStats } from '@/contexts/WebsocketContext'
import SerialConnectionIcon from '@/components/serial/serial-connection-icon'
import SerialSpeedIcon from '@/components/serial/serial-speed-icon'
import SerialPacketsIcon from '@/components/serial/serial-packets-icon'
import { WEBSOCKET_PORT, DEVELOPMENT_MODE } from '@/utils/config'

export default function SerialStatus () {
  const { status, rate, pps } = useWebsocketStats()

  return (
    <div
      className='h-7 shrink-0 flex items-center justify-between gap-4 border-t-2 border-primary-muted bg-primary px-3'
    >
      <div
        className='flex items-center divide-x-2 divide-primary-muted'
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
            className='text-[10px] tracking-widest text-negative'
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
