import TelemetryHeader from '@/components/telemetry/telemetry-header'
import TelemetryTableCell from '@/components/telemetry-table/telemetry-table-cell'
// import VisualizerScene from '@/components/visualizer/visualizer-scene'
// import Panel from '@/components/ui/panel'
import { telemetryTableFields } from '@/utils/utils'

interface TelemetryContainerProps {
  data: WebsocketTelemetryData
}

export default function TelemetryContainer ({
  data
}: TelemetryContainerProps) {
  return (
    <div
      className='flex flex-col gap-2 p-2'
    >
      <TelemetryHeader
        sync={data.sync}
        tick={data.tick}
        state={data.state}
        flags={data.flags}
        pressurePa={data.pressurePa}
        temperatureC={data.temperatureC}
        batteryVoltage={data.batteryVoltage}
      />
      <div
        className='flex flex-1 gap-2'
      >
        <div
          className='grid flex-1 grid-cols-4 gap-2'
        >
          {
            telemetryTableFields.map((table) => (
              <TelemetryTableCell
                key={table.name}
                name={table.name}
                className={table.className}
                accentClassName={table.accentClassName}
                fields={
                  table.fields.map((field) => {
                    const value = field.value(data) ?? 0

                    return {
                      ...field,
                      value,
                      className: field.getClassName?.(value) ?? field.className
                    }
                  })
                }
              />
            ))
          }
        </div>
        {/* 3D orientation viewer, uncomment this block and its two imports to bring it back
        <Panel
          title='ORIENTATION'
          accentClassName='text-orientation'
          className='w-64 shrink-0'
        >
          <VisualizerScene
            roll={0}
            pitch={0}
            yaw={0}
          />
        </Panel>
        */}
      </div>
    </div>
  )
}
