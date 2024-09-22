import useSocket from "../../hooks/useSocket"

export default function GameCard({
    title,
    color,
    index
}: {
    title: string,
    color?: string,
    index: number
}) {

    const { socket, token } = useSocket();

    return <>
        <div
            className={`w-[140px] h-[90px] flex items-center justify-center w-aut border-2 border-white rounded-lg uppercase text-2xl`}
            style={{ backgroundColor: color ? color : 'gray' }}
            onClick={() => { console.log('emit', index, token);socket.emit('gameFlipCard', { token, cardPosition: index }) }}
        >
            <div>
                {title}
            </div>
        </div>
    </>
}