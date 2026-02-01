import TelemetryHeader from '@/components/telemetry/telemetry-header'
import TelemetryTableCell from '@/components/telemetry-table/telemetry-table-cell'
import VisualizerScene from '@/components/visualizer/visualizer-scene'
import { telemetryTableFields } from '@/utils/utils'

interface TelemetryProps {
  data: TelemetryPacket
}

export default function Telemetry ({
  data
}: TelemetryProps) {
  return (
    <div
      className='h-full flex flex-col gap-2 p-2 text-primary-foreground'
    >
      <TelemetryHeader
        timestamp={data.timestamp}
        batteryVoltage={data.batteryVoltage}
        temperature={data.temperature}
      />
      <div
        className='h-full flex gap-1'
      >
        <div
          className='flex-1 grid grid-cols-3 gap-1'
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
