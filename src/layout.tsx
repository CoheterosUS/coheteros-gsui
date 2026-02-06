import { Outlet } from 'react-router'
import Sidebar from '@/components/sidebar/sidebar'
import SerialStatus from '@/components/serial/serial-status'

export default function AppLayout () {
  return (
    <div
      className='relative h-screen bg-background text-foreground'
    >
      <div
        className='h-full fixed top-0 left-0 z-20'
      >
        <Sidebar />
      </div>
      <div
        className='h-full flex flex-1 flex-col ml-14 overflow-hidden'
      >
        <main
          className='flex-1 overflow-auto'
        >
          <Outlet />
        </main>
        <SerialStatus />
      </div>
    </div>
  )
}
