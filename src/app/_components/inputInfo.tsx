interface InputInfoProps {
  label: string
  value: string
  placeholder: string
  type: 'date' | 'text' | 'email' | 'cpf'
  onChange: (e: string) => void
}

export function InputInfo({
  label,
  type,
  value,
  placeholder,
  onChange,
}: InputInfoProps) {
  function formatDate(value: string) {
    const cleanedValue = value.replace(/\D/g, '')

    const formattedValue = cleanedValue
      .replace(/^(\d{2})(\d)/, '$1/$2')
      .replace(/^(\d{2}\/\d{2})(\d)/, '$1/$2')

    return formattedValue.substring(0, 10)
  }

  function formatCPF(cpf: string): string {
    const onlyNumbers = cpf.replace(/\D/g, '')

    return onlyNumbers
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
      .substring(0, 14)
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target

    let formattedValue = value
    if (type === 'date') {
      formattedValue = formatDate(value)
    }
    if (type === 'cpf') {
      formattedValue = formatCPF(value)
    }

    onChange(formattedValue)
  }

  return (
    <div className="flex flex-col w-full gap-1">
      <label htmlFor={label} className="text-black dark:text-white">
        {label}
      </label>
      <div className="flex">
        <input
          onChange={handleInputChange}
          type={type === 'date' || type === 'cpf' ? 'text' : 'text'}
          value={value}
          placeholder={placeholder}
          className=" flex-grow px-3 py-2 bg-transparent border border-gray-800 rounded-md text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
          style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
          id={label}
        />
      </div>
    </div>
  )
}
