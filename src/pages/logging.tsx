import { useWebsocketContext } from '@/contexts/WebsocketContext'
import Logging from '@/components/logging/logging'
import TelemetryEmpty from '@/components/telemetry/telemetry-empty'
import { MAX_DATA_POINTS } from '@/utils/config'

export default function LoggingPage () {
  const { data } = useWebsocketContext()

  return data.length > 0 ? (
    <div
      className='h-full flex flex-col'
    >
      {
        data.length >= MAX_DATA_POINTS && (
          <p
            className='p-4 text-xs text-primary-muted-foreground border-b border-primary-muted'
          >
            DISPLAYING LAST {MAX_DATA_POINTS} PACKETS
          </p>
        )
      }
      <Logging
        data={data}
      />
    </div>
  ) : (
    <TelemetryEmpty />
  )
}
