import SerialConnectionIcon from '@/components/serial/serial-connection-icon'

interface SerialStatusProps {
  status: string
}

export default function SerialStatus ({
  status
}: SerialStatusProps) {
  return (
    <div
      className='w-full h-6 flex items-center justify-end px-2 py-1 bg-primary'
    >
      <SerialConnectionIcon
        status={status}
      />
    </div>
  )
}
