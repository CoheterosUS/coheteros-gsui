// import { telemetryFields } from '@/utils/utils'
// import TelemetryTableField from '@/components/telemetry/telemetry-table-field'
import TelemetryTableHeader from '@/components/telemetry/telemetry-table-header'
import TelemetryTableAcceleration from '@/components/telemetry/telemetry-table-acceleration'

interface TelemetryTableProps {
  data: TelemetryPacket
}

export default function TelemetryTable ({
  data
}: TelemetryTableProps) {
  return (
    <div
      className='flex flex-col gap-2 p-2 text-primary-foreground'
    >
      <TelemetryTableHeader
        timestamp={data.timestamp}
        batteryVoltage={data.batteryVoltage}
        temperature={data.temperature}
      />
      <TelemetryTableAcceleration
        accelerationX={data.accelerationX}
        accelerationY={data.accelerationY}
        accelerationZ={data.accelerationZ}
        totalAcceleration={data.totalAcceleration}
      />
      {/* <div
        className='grid grid-cols-5 gap-2'
      >
        {
          telemetryFields.map((field) => (
            <TelemetryTableField
              key={field.label}
              label={field.label}
              value={field.value(data)}
            />
          ))
        }
      </div> */}
    </div>
  )
}
