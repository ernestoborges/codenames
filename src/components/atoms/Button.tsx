export default function Button({
  children,
  onClick,
  className,
  disabled,
  name,
  type = 'button'
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  name?: string
}) {
  if (disabled) {
    return (
      <button
        className={`flex items-center justify-center rounded-lg border border-green-500 p-1 text-green-500 ${className}`}
        type={type}
        onClick={onClick}
        disabled={disabled}
        name={name}
      >
        {children}
      </button>
    )
  }

  return (
    <button
      className={`flex items-center justify-center rounded-lg border border-transparent bg-green-500 p-1 hover:bg-green-400 ${className}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
      name={name}
    >
      {children}
    </button>
  )
}
