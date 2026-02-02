import type { ChangeEvent } from 'react'

interface ControlsDropdownProps {
  label: string
  options: string[]
  selectedOption: string
  setSelectedOption: (option: string) => void
}

export default function ControlsDropdown ({
  label,
  options,
  selectedOption,
  setSelectedOption
}: ControlsDropdownProps) {
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
        className='px-4 py-2 rounded border-dashed border-2 cursor-pointer focus:outline-none hover:border-solid transition'
        value={selectedOption}
        onChange={handleChange}
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
