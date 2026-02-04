import { useEffect, useState } from 'react'
import ControlsButton from '@/components/controls/controls-button'
import ControlsDropdown from '@/components/controls/controls-dropdown'
import ControlsSection from '@/components/controls/controls-section'
import useFetchState from '@/hooks/useFetchState'
import { useWebsocketContext } from '@/contexts/WebsocketContext'
import { DEFAULT_BAUDRATE, ALLOW_FAKE_PACKETS, BAUDRATE_OPTIONS } from '@/utils/config'

export default function ControlsPage () {
  const { status, send, reconnect } = useWebsocketContext()
  const { data, getData } = useFetchState<ControlsResponse>()
  const [inputPort, setInputPort] = useState<string>('')
  const [baudrate, setBaudrate] = useState<string>(DEFAULT_BAUDRATE)

  const handleCommand = async (type: string, data?: string) => {
    send({
      type,
      data
    })

    await fetchPorts()
  }

  const handlePorts = async (disconnect: boolean = false) => {
    const command = disconnect ? 'DISCONNECT_SERIAL' : 'CONNECT_SERIAL'
    const commandData = disconnect ? undefined : JSON.stringify({
      input_port: inputPort,
      baudrate: baudrate
    })

    await handleCommand(command, commandData)
  }

  const fetchPorts = async () => {
    const { data } = await getData('/api/controls')
    if (data == null) {
      return
    }

    if (data.ports.available_ports.length > 0) {
      setInputPort(data.ports.port_in_use == null ? data.ports.available_ports[0].name : data.ports.port_in_use.name)
      setBaudrate(data.ports.port_in_use == null ? DEFAULT_BAUDRATE : data.ports.port_in_use.baudrate ?? DEFAULT_BAUDRATE)
    }
  }

  useEffect(() => {
    fetchPorts()
  }, [])

  return (
    <div
      className='h-full flex flex-col'
    >
      <p
        className='mx-4 mt-4 text-xl text-primary-foreground'
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
            label='DEPLOY PARACHUTE'
            onClick={() => handleCommand('DEPLOY_PARACHUTE')}
            disabled={status !== 'connected'}
          />
        </ControlsSection>
        <ControlsSection
          title='SERIAL'
        >
          {
            data != null && data.ports.available_ports.length > 0 ? (
              <>
                <div
                  className='flex flex-col gap-2'
                >
                  <div
                    className='flex flex-row gap-2'
                  >
                    <ControlsDropdown
                      label='PORT'
                      options={data.ports.available_ports.map(port => port.name)}
                      selectedOption={inputPort}
                      setSelectedOption={setInputPort}
                      disabled={data.ports.port_in_use != null}
                    />
                    <ControlsDropdown
                      label='BAUDRATE'
                      options={[...BAUDRATE_OPTIONS]}
                      selectedOption={baudrate}
                      setSelectedOption={setBaudrate}
                      disabled={data.ports.port_in_use != null}
                    />
                  </div>
                  <ControlsButton
                    label='CONNECT'
                    onClick={() => handlePorts()}
                    disabled={data.fake_telemetry_enabled || data.ports.port_in_use != null}
                  />
                  <ControlsButton
                    label='DISCONNECT'
                    onClick={() => handlePorts(true)}
                    variant='danger'
                    disabled={data.ports.port_in_use == null}
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
                  No serial ports available.
                </p>
                <ControlsButton
                  label='REFRESH PORTS'
                  onClick={fetchPorts}
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
            ALLOW_FAKE_PACKETS && data != null ? (
              <>
                <ControlsButton
                  label='START FAKE TELEMETRY'
                  onClick={() => handleCommand('START_FAKE_TELEMETRY')}
                  disabled={data.fake_telemetry_enabled || data.ports.port_in_use != null}
                />
                <ControlsButton
                  label='STOP FAKE TELEMETRY'
                  onClick={() => handleCommand('STOP_FAKE_TELEMETRY')}
                  variant='danger'
                  disabled={!data.fake_telemetry_enabled}
                />
              </>
            ) : (
              <p
                className='text-primary-muted-foreground'
              >
                Fake telemetry packets are disabled in the configuration.
              </p>
            )
          }
        </ControlsSection>
      </div>
    </div>
  )
}
