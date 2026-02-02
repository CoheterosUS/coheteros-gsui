interface ControlsButtonProps {
  label: string
  disabled?: boolean
  onClick?: () => void
}

export default function ControlsButton ({
  label,
  disabled = false,
  onClick
}: ControlsButtonProps) {
  const buttonStyle = `
    px-4 py-2 text-primary-foreground border-dashed border-2 border-primary-foreground bg-primary cursor-pointer hover:bg-primary-foreground hover:text-primary transition
    disabled:cursor-default disabled:border-primary-muted disabled:text-primary-muted disabled:bg-transparent
  `

  return (
    <button
      className={buttonStyle}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  )
}
