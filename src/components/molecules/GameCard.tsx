export default function GameCard({
    title,
    color
}: {
    title: string,
    color?: string
}) {

    return <>
        <div
            className={`w-[140px] h-[90px] flex items-center justify-center w-aut border-2 border-white rounded-lg uppercase text-2xl`}
            style={{ backgroundColor: color ? color : 'gray' }}
        >
            <div>
                {title}
            </div>
        </div>
    </>
}