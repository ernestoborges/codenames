export default function Button({
    children,
    onClick,
    className,
    disabled,
    name,
    type = 'button'
}: {
    children: any
    onClick?: () => any
    className?: string
    disabled?: boolean
    type?: "button" | "submit" | "reset"
    name?: string
}) {

    if (disabled) {
        return <>
            <button
                className={` border-green-500 text-green-500 border rounded-lg p-1 flex items-center justify-center ${className}`}
                type={type}
                onClick={onClick}
                disabled={disabled}
                name={name}
            >
                {children}
            </button>
        </>
    }

    return <>
        <button
            className={`bg-green-500 hover:bg-green-400  border-transparent border rounded-lg p-1 flex items-center justify-center ${className}`}
            type={type}
            onClick={onClick}
            disabled={disabled}
            name={name}
        >
            {children}
        </button>
    </>
}