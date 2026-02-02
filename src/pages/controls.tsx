import { useWebsocketContext } from '@/components/contexts/WebsocketContext'
import ControlsButton from '@/components/controls/controls-button'
import ControlsSection from '@/components/controls/controls-section'
import SerialStatus from '@/components/serial/serial-status'
import Sidebar from '@/components/sidebar/sidebar'

export default function ControlsPage () {
  const { status, downlink, pps } = useWebsocketContext()

  return (
    <div
      className='w-full h-screen flex bg-background'
    >
      <Sidebar />
      <div
        className='w-full h-full flex flex-col'
      >
        <p
          className='text-xl text-primary-foreground mx-2 mt-2'
        >
          CONTROLS
        </p>
        <div
          className='flex flex-col'
        >
          <ControlsSection
            title='ACTIONS'
          >
            <ControlsButton
              label='DEPLOY DROGUE PARACHUTE'
            />
            <ControlsButton
              label='DEPLOY MAIN PARACHUTE'
            />
          </ControlsSection>
          <ControlsSection
            title='TESTING'
          >
            <ControlsButton
              label='START FAKE TELEMETRY'
            />
            <ControlsButton
              label='STOP FAKE TELEMETRY'
            />
          </ControlsSection>
        </div>
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
