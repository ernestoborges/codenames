import Button from '../atoms/button'
import LoadingSpin from '../atoms/loading-spin'

interface TextButtonProps {
  title: string
  onClick?: () => void
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  name?: string
  isLoading?: boolean
}

export default function TextButton({
  title,
  name,
  isLoading,
  onClick,
  disabled,
  type,
  className
}: TextButtonProps) {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={`text-2xl ${className}`}
      name={name}
      isLoading={isLoading}
    >
      {isLoading ? <LoadingSpin size={20} /> : title}
    </Button>
  )
}
