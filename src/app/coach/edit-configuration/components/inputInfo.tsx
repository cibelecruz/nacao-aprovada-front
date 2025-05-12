'use client'

import { useEffect, useState } from 'react'

interface InputInfoProps {
  label: string
  value: string
  type: 'date' | 'text' | 'email' | 'tel'
  onChange: (value: string) => void
}

export function InputInfo({ label, type, value, onChange }: InputInfoProps) {
  const [inputValue, setInputValue] = useState(value || '')

  useEffect(() => {
    setInputValue(value)
  }, [value])

  function formatDate(value: string) {
    const cleanedValue = value.replace(/\D/g, '')

    const formattedValue = cleanedValue
      .replace(/^(\d{2})(\d)/, '$1/$2')
      .replace(/^(\d{2}\/\d{2})(\d)/, '$1/$2')

    return formattedValue.substring(0, 10)
  }

  function formatPhone(value: string) {
    const cleanedValue = value.replace(/\D/g, '')

    const formattedValue = cleanedValue
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')

    return formattedValue.substring(0, 15)
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target

    let formattedValue = value
    if (type === 'date') {
      formattedValue = formatDate(value)
    } else if (type === 'tel') {
      formattedValue = formatPhone(value)
    }

    setInputValue(formattedValue)
    onChange(formattedValue)
  }

  return (
    <div className="flex flex-col w-max">
      <label htmlFor="">{label}</label>
      <div className="flex">
        <input
          onChange={handleInputChange}
          type={type === 'date' ? 'text' : type}
          value={inputValue}
          className="bg-transparent w-full border border-zinc-400 rounded-md p-2"
        />
      </div>
    </div>
  )
}
