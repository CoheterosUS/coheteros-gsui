import TelemetryHeader from '@/components/telemetry/telemetry-header'
import TelemetryTableCell from '@/components/telemetry-table/telemetry-table-cell'
import VisualizerScene from '@/components/visualizer/visualizer-scene'
import { telemetryTableFields } from '@/utils/utils'

interface TelemetryProps {
  data: TelemetryData
}

export default function Telemetry ({
  data
}: TelemetryProps) {
  return (
    <div
      className='flex flex-col gap-2 p-2 text-primary-foreground'
    >
      <TelemetryHeader
        timestamp={data.timestamp}
        batteryVoltage={data.batteryVoltage}
        temperature={data.temperature}
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
                    value: field.value(data)
                  }))
                }
              />
            ))
          }
        </div>
        <VisualizerScene
          roll={data.roll}
          pitch={data.pitch}
          yaw={data.yaw}
        />
      </div>
    </div>
  )
}
