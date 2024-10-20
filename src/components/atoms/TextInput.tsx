export function TextInput({
    value,
    onchange,
    placeholder,
    className
}: {
    value: string | number
    onchange: (text: string) => void
    placeholder?: string
    className?: string
}) {
    return <>
        <input
            className={`text-black p-2 rounded-sm ${className}`}
            value={value}
            onChange={(e) => onchange(e.target.value)}
            placeholder={placeholder ? placeholder : ''}
        />
    </>
}