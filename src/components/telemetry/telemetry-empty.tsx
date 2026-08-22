export default function TelemetryEmpty () {
  return (
    <div
      className='h-full grid place-items-center'
    >
      <div
        className='flex flex-col items-center gap-2 border-2 border-dashed border-primary-muted px-10 py-8'
      >
        <p
          className='tracking-widest'
        >
          AWAITING TELEMETRY
        </p>
        <p
          className='text-sm text-primary-muted-foreground'
        >
          NO PACKET RECEIVED YET
        </p>
      </div>
    </div>
  )
}
