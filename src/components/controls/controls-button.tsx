interface ControlsButtonProps {
  label: string
  disabled?: boolean
  onClick?: () => void
  variant?: 'danger'
}

export default function ControlsButton ({
  label,
  disabled = false,
  onClick,
  variant
}: ControlsButtonProps) {
  const buttonStyle = `
    px-4 py-2 text-primary-foreground border-dashed border-2 bg-primary cursor-pointer transition
    disabled:cursor-default disabled:border-primary-muted disabled:text-primary-muted disabled:bg-transparent
    ${variant === 'danger' ? 'border-negative text-negative hover:bg-negative' : 'border-primary-foreground hover:text-primary hover:bg-primary-foreground'}
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
