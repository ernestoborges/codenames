interface InputProps {
  value: string | number
  onchange: (text: string) => void
  placeholder?: string
  className?: string
  type?: string
}

export function Input({
  value,
  onchange,
  placeholder,
  className,
  type = 'text'
}: InputProps) {
  return (
    <input
      className={`rounded-sm p-2 text-black ${className}`}
      value={value}
      onChange={(e) => onchange(e.target.value)}
      placeholder={placeholder ? placeholder : ''}
      type={type}
    />
  )
}
