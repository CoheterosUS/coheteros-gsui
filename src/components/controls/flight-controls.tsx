import { useEffect, useState } from 'react'
import { useWebsocketAPI, useWebsocketStats } from '@/contexts/WebsocketContext'
import ControlsButton from '@/components/controls/controls-button'
import ControlsSection from '@/components/controls/controls-section'
import useFetchState from '@/hooks/useFetchState'
import { STATE_IDLE } from '@/utils/config'

interface FlightControlsProps {
  bordered?: boolean
}

export default function FlightControls ({
  bordered = true
}: FlightControlsProps) {
  const { send, subscribe } = useWebsocketAPI()
  const { status } = useWebsocketStats()
  const { data, getData } = useFetchState<WebsocketStateUpdateData>()
  const [flightState, setFlightState] = useState<number | null>(null)

  const handleCommand = async (type: WebsocketCommandType, payload?: string) => {
    send({
      type,
      data: payload
    })

    await fetchControls()
  }

  // RESET and ABORT act on the vehicle and cannot be undone from here
  const handleConfirmedCommand = async (type: WebsocketCommandType, prompt: string) => {
    if (!window.confirm(prompt)) {
      return
    }

    await handleCommand(type)
  }

  const fetchControls = async () => {
    if (status !== 'connected') {
      return
    }

    await getData('/api/status')
  }

  useEffect(() => {
    fetchControls()
  }, [status])

  // the vehicle state only ever comes from telemetry, never from a local guess
  useEffect(() => {
    const unsubscribe = subscribe('TELEMETRY_PACKET', (packet) => {
      setFlightState((current) => current === packet.state ? current : packet.state)
    })

    return () => {
      unsubscribe()
    }
  }, [subscribe])

  const isDisabled = data == null || status !== 'connected'
  const noSerial = isDisabled || data.serial_port == null

  // calibration is only accepted on the pad, before the state machine advances
  const canCalibrate = !noSerial && flightState === STATE_IDLE

  return (
    <>
      <ControlsSection
        title='CSV RECORDING'
        bordered={bordered}
      >
        <ControlsButton
          label='START RECORDING'
          onClick={() => handleCommand('START_CSV_RECORD')}
          variant='positive'
          disabled={isDisabled || (data?.is_recording_csv ?? false)}
        />
        <ControlsButton
          label='STOP RECORDING'
          onClick={() => handleCommand('STOP_CSV_RECORD')}
          variant='danger'
          disabled={isDisabled || !(data?.is_recording_csv ?? false)}
        />
      </ControlsSection>
      <ControlsSection
        title='FLIGHT COMMANDS'
        bordered={bordered}
      >
        <ControlsButton
          label='CALIBRATION'
          onClick={() => handleCommand('CALIBRATION')}
          disabled={!canCalibrate}
        />
        <ControlsButton
          label='RESET'
          onClick={() => handleConfirmedCommand('RESET', 'Send RESET to the flight controller?')}
          variant='danger'
          disabled={noSerial}
        />
        <ControlsButton
          label='GROUND ABORT'
          onClick={() => handleConfirmedCommand('GROUND_ABORT', 'Send GROUND ABORT to the flight controller? This ends the flight.')}
          variant='danger'
          disabled={noSerial}
        />
      </ControlsSection>
      <ControlsSection
        title='ACTIONS'
        bordered={bordered}
      >
        <ControlsButton
          label='DEPLOY DROGUE'
          onClick={() => handleConfirmedCommand('DROGUE', 'Fire the drogue pyro channel?')}
          variant='danger'
          disabled={noSerial}
        />
      </ControlsSection>
    </>
  )
}
