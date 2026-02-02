import { useWebsocketContext } from '@/components/contexts/WebsocketContext'
import Logging from '@/components/logging/logging'
import { MAX_DATA_POINTS } from '@/utils/config'

export default function LoggingPage () {
  const { data } = useWebsocketContext()

  return (
    <div
      className='h-full flex flex-col'
    >
      <p
        className='px-4 pt-4 text-xl text-primary-foreground'
      >
        LOGGING
      </p>
      <div
        className='flex-1 overflow-y-auto'
      >
        {
          data.length >= MAX_DATA_POINTS && (
            <p
              className='px-4 pt-4 text-xs text-primary-muted-foreground'
            >
              Displaying latest {MAX_DATA_POINTS} packets
            </p>
          )
        }
        <Logging
          data={data}
        />
      </div>
    </div>
  )
}
