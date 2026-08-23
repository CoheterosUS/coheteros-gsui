import { useEffect, useState } from 'react'
import { useWebsocketAPI, useWebsocketStats } from '@/contexts/WebsocketContext'
import useFetchState from '@/hooks/useFetchState'
import ControlsButton from '@/components/controls/controls-button'
import ControlsDropdown from '@/components/controls/controls-dropdown'
import Panel from '@/components/ui/panel'
import { DEFAULT_BAUDRATE, BAUDRATE_OPTIONS, DEVELOPMENT_MODE, WEBSOCKET_PORT } from '@/utils/config'

interface SettingsRowProps {
  label: string
  value: string
  className?: string
}

function SettingsRow ({
  label,
  value,
  className = 'text-primary-foreground'
}: SettingsRowProps) {
  return (
    <div
      className='flex items-baseline justify-between gap-4 text-sm'
    >
      <span
        className='text-primary-muted-foreground'
      >
        {label}
      </span>
      <span
        className={`tabular-nums ${className}`}
      >
        {value}
      </span>
    </div>
  )
}

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
  const isSerialConnected = data != null && data.serial_port != null

  const websocketClassName = status === 'connected'
    ? 'text-positive'
    : status === 'reconnecting'
      ? 'text-warning'
      : 'text-negative'

  return (
    <div
      className='h-full overflow-auto p-4'
    >
      <div
        className='mx-auto flex w-full max-w-3xl flex-col gap-4'
      >
        <Panel
          title='SERIAL'
          accentClassName='text-status'
          contentClassName='flex flex-col gap-3 px-3 py-3'
        >
          <SettingsRow
            label='CONNECTION'
            value={isSerialConnected ? 'CONNECTED' : 'DISCONNECTED'}
            className={isSerialConnected ? 'text-positive' : 'text-primary-muted-foreground'}
          />
          <SettingsRow
            label='ACTIVE PORT'
            value={data?.serial_port ?? '—'}
          />
          <SettingsRow
            label='ACTIVE BAUDRATE'
            value={data?.serial_baudrate == null ? '—' : String(data.serial_baudrate)}
          />
          {
            data != null && data.serial_available_ports.length > 0 ? (
              <div
                className='flex flex-col gap-3 border-t-2 border-primary pt-3'
              >
                <div
                  className='flex flex-row flex-wrap gap-3'
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
                <div
                  className='flex flex-row flex-wrap gap-2'
                >
                  <ControlsButton
                    label='CONNECT'
                    onClick={() => handlePorts()}
                    variant='positive'
                    disabled={disablePortSelection}
                  />
                  <ControlsButton
                    label='DISCONNECT'
                    onClick={() => handlePorts(true)}
                    variant='danger'
                    disabled={!isSerialConnected}
                  />
                  <ControlsButton
                    label='REFRESH PORTS'
                    onClick={fetchControls}
                    disabled={status !== 'connected'}
                  />
                </div>
              </div>
            ) : (
              <div
                className='flex flex-col items-start gap-2 border-t-2 border-primary pt-3'
              >
                <p
                  className='text-sm text-primary-muted-foreground'
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
        </Panel>
        <Panel
          title='WEBSOCKET'
          accentClassName='text-position'
          contentClassName='flex flex-col gap-3 px-3 py-3'
        >
          <SettingsRow
            label='STATUS'
            value={status.toUpperCase()}
            className={websocketClassName}
          />
          <SettingsRow
            label='BACKEND PORT'
            value={String(WEBSOCKET_PORT)}
          />
          <div
            className='flex border-t-2 border-primary pt-3'
          >
            <ControlsButton
              label='FORCE RECONNECTION'
              onClick={reconnect}
              variant='danger'
              disabled={status === 'connected' || status === 'reconnecting'}
            />
          </div>
        </Panel>
        <Panel
          title='TESTING'
          accentClassName='text-orientation'
          contentClassName='flex flex-col gap-3 px-3 py-3'
        >
          {
            DEVELOPMENT_MODE && data != null ? (
              <>
                <SettingsRow
                  label='FAKE TELEMETRY'
                  value={data.is_sending_fake_telemetry ? 'RUNNING' : 'STOPPED'}
                  className={data.is_sending_fake_telemetry ? 'text-warning' : 'text-primary-muted-foreground'}
                />
                <div
                  className='flex flex-row flex-wrap gap-2 border-t-2 border-primary pt-3'
                >
                  <ControlsButton
                    label='START FAKE TELEMETRY'
                    onClick={() => handleCommand('START_FAKE_TELEMETRY')}
                    variant='positive'
                    disabled={disablePortSelection}
                  />
                  <ControlsButton
                    label='STOP FAKE TELEMETRY'
                    onClick={() => handleCommand('STOP_FAKE_TELEMETRY')}
                    variant='danger'
                    disabled={!data.is_sending_fake_telemetry}
                  />
                </div>
              </>
            ) : (
              <p
                className='text-sm text-primary-muted-foreground'
              >
                FAKE TELEMETRY PACKETS ARE DISABLED
              </p>
            )
          }
        </Panel>
      </div>
    </div>
  )
}
