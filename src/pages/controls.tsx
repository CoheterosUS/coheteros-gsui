import { useEffect, useState } from 'react'
import ControlsButton from '@/components/controls/controls-button'
import ControlsDropdown from '@/components/controls/controls-dropdown'
import ControlsSection from '@/components/controls/controls-section'
import useFetchState from '@/hooks/useFetchState'
import { useWebsocketContext } from '@/contexts/WebsocketContext'
import { DEFAULT_BAUDRATE, TESTING_MODE } from '@/utils/config'

export default function ControlsPage () {
  const { status, send, reconnect } = useWebsocketContext()
  const { data, getData } = useFetchState<SerialPortsResponse>()
  const [inputPort, setInputPort] = useState<string>('')
  const [baudrate, setBaudrate] = useState<string>(DEFAULT_BAUDRATE)

  const handleCommand = (type: string) => {
    send({
      type
    })
  }

  const handlePorts = async (disconnect: boolean = false) => {
    send({
      type: disconnect ? 'DISCONNECT_SERIAL' : 'CONNECT_SERIAL',
      data: disconnect ? undefined : JSON.stringify({
        input_port: inputPort,
        baudrate: baudrate
      })
    })

    await fetchPorts()
  }

  const fetchPorts = async () => {
    const { data } = await getData('/ports')
    if (data == null) {
      return
    }

    if (data.available_ports.length > 0) {
      setInputPort(data.port_in_use == null ? data.available_ports[0].name : data.port_in_use.name)
      setBaudrate(data.port_in_use == null ? DEFAULT_BAUDRATE : data.port_in_use.baudrate ?? DEFAULT_BAUDRATE)
    }
  }

  useEffect(() => {
    fetchPorts()
  }, [])

  const connected = data?.port_in_use != null

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
          />
        </ControlsSection>
        <ControlsSection
          title='SERIAL'
        >
          {
            data != null && data.available_ports.length > 0 ? (
              <>
                <div
                  className='flex flex-col gap-2'
                >
                  <div
                    className='flex flex-row gap-2'
                  >
                    <ControlsDropdown
                      label='PORT'
                      options={data.available_ports.map(port => port.name)}
                      selectedOption={inputPort}
                      setSelectedOption={setInputPort}
                      disabled={connected}
                    />
                    <ControlsDropdown
                      label='BAUDRATE'
                      options={['9600', '19200', '38400', '57600', '115200']}
                      selectedOption={baudrate}
                      setSelectedOption={setBaudrate}
                      disabled={connected}
                    />
                  </div>
                  <ControlsButton
                    label='CONNECT'
                    onClick={() => handlePorts()}
                    disabled={connected}
                  />
                  <ControlsButton
                    label='DISCONNECT'
                    onClick={() => handlePorts(true)}
                    variant='danger'
                    disabled={!connected}
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
            TESTING_MODE ? (
              <>
                <ControlsButton
                  label='START FAKE TELEMETRY'
                  onClick={() => handleCommand('START_FAKE_TELEMETRY')}
                />
                <ControlsButton
                  label='STOP FAKE TELEMETRY'
                  onClick={() => handleCommand('STOP_FAKE_TELEMETRY')}
                />
              </>
            ) : (
              <p
                className='text-primary-muted-foreground'
              >
                Testing mode is disabled.
              </p>
            )
          }
        </ControlsSection>
      </div>
    </div>
  )
}
