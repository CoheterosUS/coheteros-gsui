import type { ChangeEvent } from 'react'

interface ControlsDropdownProps {
  label: string
  options: string[]
  selectedOption: string
  setSelectedOption: (option: string) => void
  disabled?: boolean
}

export default function ControlsDropdown ({
  label,
  options,
  selectedOption,
  setSelectedOption,
  disabled = false
}: ControlsDropdownProps) {
  const dropdownStyle = `
    px-3 py-1 text-xs tracking-widest bg-primary border-2 border-primary text-primary-muted-foreground
    cursor-pointer transition-colors duration-100 hover:border-primary-foreground hover:text-primary-foreground
    focus:outline-none focus-visible:border-primary-foreground focus-visible:text-primary-foreground
    disabled:cursor-not-allowed disabled:border-primary disabled:bg-transparent disabled:text-primary-muted
    disabled:hover:border-primary disabled:hover:text-primary-muted
  `

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value)
  }

  return (
    <div
      className='relative flex flex-col gap-2'
    >
      <p
        className='text-xs tracking-widest text-primary-muted-foreground'
      >
        {label}
      </p>
      <select
        className={dropdownStyle}
        value={selectedOption}
        onChange={handleChange}
        disabled={disabled}
      >
        {
          options.map((option, index) => (
            <option
              key={index}
              value={option}
              className='bg-primary'
            >
              {option}
            </option>
          ))
        }
      </select>
    </div>
  )
}
