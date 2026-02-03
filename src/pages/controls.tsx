import { useEffect, useState } from 'react'
import ControlsButton from '@/components/controls/controls-button'
import ControlsDropdown from '@/components/controls/controls-dropdown'
import ControlsSection from '@/components/controls/controls-section'
import useFetchState from '@/hooks/useFetchState'
import { useWebsocketContext } from '@/components/contexts/WebsocketContext'

export default function ControlsPage () {
  const { sendCommand } = useWebsocketContext()
  const { data, getData } = useFetchState<SerialPort[]>()
  const [inputPort, setInputPort] = useState<string>('')
  const [outputPort, setOutputPort] = useState<string>('')

  const handleCommand = (type: string) => {
    sendCommand({
      type
    })
  }

  const handlePorts = () => {
    sendCommand({
      type: 'SET_PORTS',
      data: JSON.stringify({
        input_port: inputPort,
        output_port: outputPort
      })
    })
  }

  const fetchPorts = async () => {
    const { data } = await getData('/ports')
    console.log('Serial Ports:', data)
    if (data == null) {
      return
    }

    console.log('Data length:', data.length)
    if (data.length >= 2) {
      setInputPort(data[0].name)
      setOutputPort(data[1].name)
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
                      label='INPUT PORT'
                      options={data.map(port => port.name)}
                      selectedOption={inputPort}
                      setSelectedOption={setInputPort}
                    />
                    <ControlsDropdown
                      label='OUTPUT PORT'
                      options={data.map(port => port.name)}
                      selectedOption={outputPort}
                      setSelectedOption={setOutputPort}
                    />
                  </div>
                  <ControlsButton
                    label='CONNECT'
                    disabled={inputPort === outputPort}
                    onClick={handlePorts}
                  />
                </div>
                {
                  inputPort === outputPort && (
                    <p
                      className='text-sm text-negative'
                    >
                      Input and output ports cannot be the same.
                    </p>
                  )
                }
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
          title='TESTING'
        >
          <ControlsButton
            label='START FAKE TELEMETRY'
            onClick={() => handleCommand('START_FAKE_PACKETS')}
          />
          <ControlsButton
            label='STOP FAKE TELEMETRY'
            onClick={() => handleCommand('STOP_FAKE_PACKETS')}
          />
        </ControlsSection>
      </div>
    </div>
  )
}
