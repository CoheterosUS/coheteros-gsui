import TelemetryHeader from '@/components/telemetry/telemetry-header'
import TelemetryTableCell from '@/components/telemetry-table/telemetry-table-cell'
import VisualizerScene from '@/components/visualizer/visualizer-scene'
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
        pressurePa={data.pressurePa}
        temperatureC={data.temperatureC}
        batteryVoltage={data.batteryVoltage}
      />
      <div
        className='flex flex-1 gap-1'
      >
        <div
          className='grid flex-1 grid-cols-3 gap-1'
        >
          {
            telemetryTableFields.map((table) => (
              <TelemetryTableCell
                key={table.name}
                name={table.name}
                className={table.className}
                fields={
                  table.fields.map((field) => ({
                    ...field,
                    value: field.value(data) ?? 0
                  }))
                }
              />
            ))
          }
        </div>
        <VisualizerScene
          roll={0}
          pitch={0}
          yaw={0}
        />
      </div>
    </div>
  )
}
