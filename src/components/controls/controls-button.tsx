interface ControlsButtonProps {
  label: string
}

export default function ControlsButton ({
  label
}: ControlsButtonProps) {
  return (
    <button
      className='px-4 py-2 text-primary-foreground border-dashed border-2 border-primary-foreground bg-primary cursor-pointer hover:bg-primary-foreground hover:text-primary transition'
    >
      {label}
    </button>
  )
}
