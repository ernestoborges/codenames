import useSocket from "../../hooks/useSocket"
import Button from "../atoms/Button";

export default function GameCard({
    title,
    color,
    index,
    tips
}: {
    title: string,
    color?: string,
    index: number,
    tips: string[]
}) {

    const { socket, token } = useSocket();

    return <>
        <div
            className={`w-[140px] h-[90px] flex flex-col items-center justify-center w-aut border-4 border-white uppercase text-2xl`}
            style={{ backgroundColor: color ? color : '#1f1f1f1f' }}
            onClick={() => { socket.emit('gameTip', { token, cardIndex: index }) }}
        >
            <ul className="flex-grow">
                {
                    tips.map((name, i) => 
                    <li key={i} className="border p-2 rounded-md">
                        {name}
                    </li>)
                }
            </ul>
            <div className="bold text-xl py-2 border-t-2 w-full flex justify-center">
                {title}
            </div>
            {/* <Button onClick={() => socket.emit('gameFlipCard', { token, cardPosition: index })}>
                virar
            </Button> */}
        </div>
    </>
}