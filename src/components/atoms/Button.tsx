export default function Button({
    children,
    onClick,
    className,
    disabled
}: {
    children: any
    onClick?: () => any
    className?: string
    disabled?: boolean
}) {

    return <>
        <button
            className={`bg-green-500 hover:bg-green-400 rounded-lg p-1 flex items-center justify-center ${className}`}
            type="button"
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    </>
}