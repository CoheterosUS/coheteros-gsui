import Sidebar from '@/components/sidebar/sidebar';

export default function ControlsPage () {
  return (
    <div
      className='h-screen flex bg-background'
    >
      <Sidebar />
      <p
        className='text-primary-foreground'
      >
        CONTROLS
      </p>
    </div>
  )
}
