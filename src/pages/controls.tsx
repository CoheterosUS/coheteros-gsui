import { useEffect, useState } from 'react'
import ControlsButton from '@/components/controls/controls-button'
import ControlsDropdown from '@/components/controls/controls-dropdown'
import ControlsSection from '@/components/controls/controls-section'
import useFetchState from '@/hooks/useFetchState'
import { useWebsocketContext } from '@/contexts/WebsocketContext'
import { DEFAULT_BAUDRATE, TESTING_MODE } from '@/utils/config'

export default function ControlsPage () {
  const { send, reconnect } = useWebsocketContext()
  const { data, getData } = useFetchState<SerialPort[]>()
  const [inputPort, setInputPort] = useState<string>('')
  const [baudrate, setBaudrate] = useState<string>(DEFAULT_BAUDRATE)

  const handleCommand = (type: string) => {
    send({
      type
    })
  }

  const handlePorts = () => {
    send({
      type: 'CONNECT_SERIAL',
      data: JSON.stringify({
        input_port: inputPort,
        baudrate: baudrate
      })
    })
  }

  const fetchPorts = async () => {
    const { data } = await getData('/ports')
    if (data == null) {
      return
    }

    if (data.length >= 2) {
      setInputPort(data[0].name)
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
          />
        </ControlsSection>
        <ControlsSection
          title='SERIAL'
        >
          {
            data != null && data.length > 0 ? (
              <>
                <div
                  className='flex flex-col gap-2'
                >
                  <div
                    className='flex flex-row gap-2'
                  >
                    <ControlsDropdown
                      label='PORT'
                      options={data.map(port => port.name)}
                      selectedOption={inputPort}
                      setSelectedOption={setInputPort}
                    />
                    <ControlsDropdown
                      label='BAUDRATE'
                      options={['9600', '19200', '38400', '57600', '115200']}
                      selectedOption={baudrate}
                      setSelectedOption={setBaudrate}
                    />
                  </div>
                  <ControlsButton
                    label='CONNECT'
                    onClick={handlePorts}
                  />
                  <ControlsButton
                    label='DISCONNECT'
                    onClick={() => handleCommand('DISCONNECT_SERIAL')}
                    variant='danger'
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
