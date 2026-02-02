import { useWebsocketContext } from '@/components/contexts/WebsocketContext'
import Sidebar from '@/components/sidebar/sidebar'
import SerialStatus from '@/components/serial/serial-status'
import Logging from '@/components/logging/logging'

export default function LoggingPage () {
  const { data, status, downlink, pps } = useWebsocketContext()

  return (
    <div
      className='w-full h-screen flex bg-background'
    >
      <Sidebar />
      <div
        className='w-full h-full flex flex-col overflow-hidden pb-6'
      >
        <Logging
          data={data}
        />
        <SerialStatus
          status={status}
          downlink={downlink}
          uplink={0}
          pps={pps}
        />
      </div>
    </div>
  )
}
