import { useEffect } from 'react'
import { useWebsocketAPI, useWebsocketStats } from '@/contexts/WebsocketContext'
import ControlsButton from '@/components/controls/controls-button'
import ControlsSection from '@/components/controls/controls-section'
import useFetchState from '@/hooks/useFetchState'

export default function ControlsPage () {
  const { send } = useWebsocketAPI()
  const { status } = useWebsocketStats()
  const { data, getData } = useFetchState<WebsocketStateUpdateData>()

  const handleCommand = async (type: WebsocketCommandType, data?: string) => {
    send({
      type,
      data
    })

    await fetchControls()
  }

  const fetchControls = async () => {
    if (status !== 'connected') {
      return
    }

    const { data } = await getData('/api/status')
    if (data == null) {
      return
    }
  }

  useEffect(() => {
    fetchControls()
  }, [status])

  const isDisabled = data == null || status !== 'connected'

  return (
    <div
      className='h-full flex flex-col'
    >
      <ControlsSection
        title='ACTIONS'
      >
        <ControlsButton
          label='DEPLOY PARACHUTE'
          onClick={() => handleCommand('DEPLOY_PARACHUTE')}
          disabled={status !== 'connected'}
        />
      </ControlsSection>
      <ControlsSection
        title='CSV RECORDING'
      >
        <ControlsButton
          label='START RECORDING'
          onClick={() => handleCommand('START_CSV_RECORD')}
          disabled={isDisabled || data.is_recording_csv}
        />
        <ControlsButton
          label='STOP RECORDING'
          onClick={() => handleCommand('STOP_CSV_RECORD')}
          variant='danger'
          disabled={isDisabled || !data.is_recording_csv}
        />
      </ControlsSection>
    </div>
  )
}
