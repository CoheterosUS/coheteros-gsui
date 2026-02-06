import { useEffect } from 'react'
import { useWebsocketAPI, useWebsocketStats } from '@/contexts/WebsocketContext'
import ControlsButton from '@/components/controls/controls-button'
import ControlsSection from '@/components/controls/controls-section'
import useFetchState from '@/hooks/useFetchState'

export default function ControlsPage () {
  const { send } = useWebsocketAPI()
  const { status } = useWebsocketStats()
  const { data, getData } = useFetchState<ControlsResponse>()

  const handleCommand = async (type: string, data?: string) => {
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

    const { data } = await getData('/api/controls')
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
          disabled={isDisabled || data.csv_recording_enabled}
        />
        <ControlsButton
          label='STOP RECORDING'
          onClick={() => handleCommand('STOP_CSV_RECORD')}
          variant='danger'
          disabled={isDisabled || !data.csv_recording_enabled}
        />
        <ControlsButton
          label='DUMP RECORDING'
          onClick={() => handleCommand('DUMP_CSV_RECORD')}
          disabled={isDisabled}
        />
      </ControlsSection>
    </div>
  )
}
