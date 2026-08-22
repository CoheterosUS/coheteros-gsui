interface ControlsButtonProps {
  label: string
  disabled?: boolean
  onClick?: () => void
  variant?: 'default' | 'danger' | 'positive'
  active?: boolean
  className?: string
}

const variants = {
  default: 'text-primary-muted-foreground hover:border-primary-foreground hover:bg-primary-foreground hover:text-primary',
  danger: 'text-negative hover:border-negative hover:bg-negative hover:text-primary-foreground',
  positive: 'text-positive hover:border-positive hover:bg-positive hover:text-primary'
}

const activeVariants = {
  default: 'border-primary-foreground bg-primary-foreground text-primary',
  danger: 'border-negative bg-negative text-primary-foreground',
  positive: 'border-positive bg-positive text-primary'
}

export default function ControlsButton ({
  label,
  disabled = false,
  onClick,
  variant = 'default',
  active = false,
  className = ''
}: ControlsButtonProps) {
  const buttonStyle = `
    px-3 py-1 text-xs tracking-widest bg-primary border-2 border-primary cursor-pointer
    transition-colors duration-100 active:translate-y-px
    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground
    disabled:cursor-not-allowed disabled:border-primary disabled:bg-transparent disabled:text-primary-muted
    disabled:active:translate-y-0 disabled:hover:border-primary disabled:hover:bg-transparent disabled:hover:text-primary-muted
    ${active ? activeVariants[variant] : variants[variant]}
    ${className}
  `

  return (
    <button
      type='button'
      className={buttonStyle}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  )
}
