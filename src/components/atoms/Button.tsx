export default function Button({
    children,
    onClick,
    className
}: {
    children: any
    onClick?: () => any
    className?: string
}) {

    return <>
        <button
            className={`bg-green-500 rounded-lg p-1 ${className}`}
            type="button"
            onClick={onClick}
        >
            {children}
        </button>
    </>
}