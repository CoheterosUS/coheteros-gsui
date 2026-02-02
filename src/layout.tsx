import { Outlet } from 'react-router'
import Sidebar from '@/components/sidebar/sidebar'
import SerialStatus from '@/components/serial/serial-status'
import { useWebsocketContext } from '@/components/contexts/WebsocketContext'

export default function AppLayout () {
  const { status, rate, pps } = useWebsocketContext()

  return (
    <div
      className='flex h-screen bg-background text-foreground'
    >
      <Sidebar />
      <div
        className='flex flex-1 flex-col overflow-hidden'
      >
        <main
          className='flex-1 overflow-auto'
        >
          <Outlet />
        </main>
        <SerialStatus
          status={status}
          rate={rate}
          pps={pps}
        />
      </div>
    </div>
  )
}
