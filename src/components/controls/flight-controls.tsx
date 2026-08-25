import { useEffect, useState } from 'react'
import { useWebsocketAPI, useWebsocketStats } from '@/contexts/WebsocketContext'
import ControlsButton from '@/components/controls/controls-button'
import ControlsSection from '@/components/controls/controls-section'
import useConfirm from '@/hooks/useConfirm'
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
  const { confirm, dialog } = useConfirm()
  const [flightState, setFlightState] = useState<number | null>(null)

  const handleCommand = async (type: WebsocketCommandType, payload?: string) => {
    send({
      type,
      data: payload
    })

    await fetchControls()
  }

  // RESET and ABORT act on the vehicle and cannot be undone from here
  const handleConfirmedCommand = async (type: WebsocketCommandType, options: ConfirmOptions) => {
    if (!await confirm(options)) {
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
          onClick={() => handleConfirmedCommand('RESET', {
            title: 'RESET',
            message: 'SEND RESET TO THE FLIGHT CONTROLLER?',
            confirmLabel: 'SEND RESET'
          })}
          variant='danger'
          disabled={noSerial}
        />
        <ControlsButton
          label='GROUND ABORT'
          onClick={() => handleConfirmedCommand('GROUND_ABORT', {
            title: 'GROUND ABORT',
            message: 'SEND GROUND ABORT TO THE FLIGHT CONTROLLER? THIS ENDS THE FLIGHT.',
            confirmLabel: 'SEND ABORT'
          })}
          variant='danger'
          disabled={noSerial}
        />
      </ControlsSection>
      <ControlsSection
        title='ACTIONS'
        bordered={bordered}
      >
        <ControlsButton
          label='MARK LANDED'
          onClick={() => handleConfirmedCommand('LANDED', {
            title: 'MARK LANDED',
            message: 'FORCE THE FLIGHT CONTROLLER INTO THE LANDED STATE?',
            confirmLabel: 'SEND LANDED'
          })}
          variant='danger'
          disabled={noSerial}
        />
        <ControlsButton
          label='DEPLOY DROGUE'
          onClick={() => handleConfirmedCommand('DROGUE', {
            title: 'DEPLOY DROGUE',
            message: 'FIRE THE DROGUE PYRO CHANNEL?',
            confirmLabel: 'FIRE DROGUE'
          })}
          variant='danger'
          disabled={noSerial}
        />
      </ControlsSection>
      {dialog}
    </>
  )
}
