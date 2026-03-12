import { useEffect, useState } from 'react'
import { useWebsocketAPI, useWebsocketStats } from '@/contexts/WebsocketContext'
import useFetchState from '@/hooks/useFetchState'
import ControlsButton from '@/components/controls/controls-button'
import ControlsDropdown from '@/components/controls/controls-dropdown'
import ControlsSection from '@/components/controls/controls-section'
import { DEFAULT_BAUDRATE, BAUDRATE_OPTIONS, DEVELOPMENT_MODE } from '@/utils/config'

export default function SettingsPage () {
  const { subscribe, send, reconnect } = useWebsocketAPI()
  const { status } = useWebsocketStats()
  const { data, getData, setData } = useFetchState<WebsocketStateUpdateData>()
  const [inputPort, setInputPort] = useState<string>('')
  const [baudrate, setBaudrate] = useState<string>(DEFAULT_BAUDRATE)

  const handlePorts = async (disconnect: boolean = false) => {
    const command = disconnect ? 'DISCONNECT_SERIAL' : 'CONNECT_SERIAL'
    const commandData = disconnect ? undefined : JSON.stringify({
      input_port: inputPort,
      baudrate: baudrate
    })

    await handleCommand(command, commandData)
  }

  const handleCommand = async (type: WebsocketCommandType, data?: string) => {
    send({
      type,
      data
    })
  }

  const updateData = (data: WebsocketStateUpdateData) => {
    if (data.serial_available_ports.length > 0) {
      setInputPort(data.serial_port == null ? data.serial_available_ports[0] : data.serial_port)
      setBaudrate(data.serial_baudrate == null ? DEFAULT_BAUDRATE : data.serial_baudrate ?? DEFAULT_BAUDRATE)
    }

    setData(data)
  }

  const fetchControls = async () => {
    if (status !== 'connected') {
      setData(null)
      return
    }

    const { data } = await getData('/api/status')
    if (data == null) {
      return
    }

    updateData(data)
  }

  useEffect(() => {
    fetchControls()
  }, [status])

  useEffect(() => {
    const unsubscribe = subscribe('STATE_UPDATE_PACKET', updateData)
    return () => {
      unsubscribe()
    }
  }, [subscribe])

  const disablePortSelection = data != null && (data.is_sending_fake_telemetry || data.serial_port != null)

  return (
    <div
      className='h-full flex flex-col'
    >
      <ControlsSection
        title='SERIAL'
      >
        {
          data != null && data.serial_available_ports.length > 0 ? (
            <>
              <div
                className='flex flex-col gap-2'
              >
                <div
                  className='flex flex-row gap-2'
                >
                  <ControlsDropdown
                    label='PORT'
                    options={data.serial_available_ports}
                    selectedOption={inputPort}
                    setSelectedOption={setInputPort}
                    disabled={disablePortSelection}
                  />
                  <ControlsDropdown
                    label='BAUDRATE'
                    options={[...BAUDRATE_OPTIONS]}
                    selectedOption={baudrate}
                    setSelectedOption={setBaudrate}
                    disabled={disablePortSelection}
                  />
                </div>
                <ControlsButton
                  label='CONNECT'
                  onClick={() => handlePorts()}
                  disabled={disablePortSelection}
                />
                <ControlsButton
                  label='DISCONNECT'
                  onClick={() => handlePorts(true)}
                  variant='danger'
                  disabled={data.serial_port == null}
                />
              </div>
            </>
          ) : (
            <div
              className='flex flex-col gap-2'
            >
              <p
                className='text-primary-muted-foreground'
              >
                NO SERIAL PORTS AVAILABLE
              </p>
              <ControlsButton
                label='REFRESH PORTS'
                onClick={fetchControls}
                disabled={status !== 'connected'}
              />
            </div>
          )
        }
      </ControlsSection>
      <ControlsSection
        title='WEBSOCKET'
      >
        <ControlsButton
          label='FORCE RECONNECTION'
          onClick={reconnect}
          variant='danger'
          disabled={status === 'connected' || status === 'reconnecting'}
        />
      </ControlsSection>
      <ControlsSection
        title='TESTING'
      >
        {
          DEVELOPMENT_MODE && data != null ? (
            <>
              <ControlsButton
                label='START FAKE TELEMETRY'
                onClick={() => handleCommand('START_FAKE_TELEMETRY')}
                disabled={disablePortSelection}
              />
              <ControlsButton
                label='STOP FAKE TELEMETRY'
                onClick={() => handleCommand('STOP_FAKE_TELEMETRY')}
                variant='danger'
                disabled={!data.is_sending_fake_telemetry}
              />
            </>
          ) : (
            <p
              className='text-primary-muted-foreground'
            >
              FAKE TELEMETRY PACKETS ARE DISABLED
            </p>
          )
        }
      </ControlsSection>
    </div>
  )
}
