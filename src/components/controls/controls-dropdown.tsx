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
    px-4 py-2 rounded border-dashed border-2 cursor-pointer focus:outline-none hover:border-solid transition
    disabled:border-dashed disabled:cursor-default disabled:border-primary-muted disabled:text-primary-muted disabled:bg-transparent
  `

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value)
  }

  return (
    <div
      className='relative flex flex-col gap-2'
    >
      <p
        className='text-sm'
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
