interface TelemetryTableAccelerationProps {
  accelerationX: number
  accelerationY: number
  accelerationZ: number
  totalAcceleration: number
}

export default function TelemetryTableAcceleration ({
  accelerationX,
  accelerationY,
  accelerationZ,
  totalAcceleration
}: TelemetryTableAccelerationProps) {
  return (
    <div
      className='border-2 border-primary rounded p-2'
    >
      <p>
        ACCELERATION
      </p>
      <p>
        X: {accelerationX.toFixed(2)} m/s²
      </p>
      <p>
        Y: {accelerationY.toFixed(2)} m/s²
      </p>
      <p>
        Z: {accelerationZ.toFixed(2)} m/s²
      </p>
      <p>
        Total Acceleration: {totalAcceleration.toFixed(2)} m/s²
      </p>
    </div>
  )
}
