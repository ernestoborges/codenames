export default function Button({
    children,
    onClick
}: {
    children: any
    onClick?: () => any
}) {

    return <>
        <button
            className="bg-green-500 rounded-lg p-1"
            type="button"
            onClick={onClick}
        >
            {children}
        </button>
    </>
}