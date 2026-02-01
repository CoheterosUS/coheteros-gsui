import Sidebar from '@/components/sidebar/sidebar'
// import SerialStatus from '@/components/serial/serial-status'
// import { useWebsocket } from '@/hooks/useWebsocket'
// import Logging from '@/components/logging/logging'

export default function LoggingPage () {
  // const { data, status, downlink, pps } = useWebsocket()

  return (
    <div
      className='h-screen flex bg-background'
    >
      <Sidebar />
      <div
        className='flex flex-1 flex-col'
      >
        {/* Investigate */}
        {/* <Logging
          data={data}
        />
        <SerialStatus
          status={status}
          downlink={downlink}
          uplink={0}
          pps={pps}
        /> */}
      </div>
    </div>
  )
}
