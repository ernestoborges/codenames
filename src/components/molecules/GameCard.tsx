import useSocket from "../../hooks/useSocket"
import Button from "../atoms/Button";
import { HiOutlineArrowUturnUp } from "react-icons/hi2";
import { FaUserSecret } from "react-icons/fa6";
import { useState } from "react";
import { MdOutlineStar } from "react-icons/md";

export default function GameCard({
    card,
    operativeTurn
}: {
    card: any,
    operativeTurn: boolean
    // title: string,
    // color?: string,
    // index: number,
    // tips: string[]
}) {

    const { socket, token } = useSocket();
    const [hover, setHover] = useState<boolean>(false);
    const [reveal, setReveal] = useState<boolean>(false);
    let color;
    switch (card.color) {
        case 0: color = '#505050'; break;
        case 1: color = '#143464'; break;
        case 2: color = '#b4202a'; break;
        case 3: color = 'black'; break;
    }

    if (card.hidden) {
        return <>
            <div
                className={`w-[154px] h-[90px] flex flex-col items-center justify-center w-aut border-4 border-white text-2xl`}
                style={{ backgroundColor: card.color !== undefined ? color : '#9c8061' }}
                onClick={() => { socket.emit('gameTip', { token, cardIndex: card.position }) }}
            >
                <div className="flex items-start justify-between flex-grow w-full">
                    <ul className="flex-grow p-1 w-full flex flex-wrap items-start justify-start text-sm overflow-y-auto scrollbar">
                        {
                            card.tips.map((name, i) =>
                                <li key={i} className="border px-1 rounded-md">
                                    {name}
                                </li>)
                        }
                    </ul>
                    {
                        operativeTurn
                            ? <div
                                className="flex items-center justify-center bg-green-500 border-green-500 border-l border-b p-1 text-3xl cursor-pointer "
                                onMouseEnter={() => setHover(true)}
                                onMouseLeave={() => setHover(false)}
                                onClick={() => socket.emit('gameFlipCard', { token, cardPosition: card.position })}
                            >
                                {
                                    hover
                                        ? <HiOutlineArrowUturnUp />
                                        : <FaUserSecret />
                                }
                            </div>
                            : <div className="flex items-center justify-center border-l border-b p-1 text-3xl">
                                <FaUserSecret />
                            </div>
                    }
                </div>
                <div className="bold text-lg border-t-2 w-full flex items-center">
                    <div className="py-2 uppercase flex justify-center w-full">
                        {card.word}
                    </div>
                </div>
            </div >
        </>
    }

    return <>
        <div
            className={`w-[154px] h-[90px] flex items-end border-4 border-white text-2xl relative overflow-hidden cursor-pointer`}
            style={{ backgroundColor: color ? color : '#1f1f1f1f' }}
            onClick={() => setReveal(!reveal)}
        >
            <div
                className="w-full h-full flex items-center justify-center text-base border-b-2  absolute transition-[top] ease-in-out duration-700"
                style={{
                    backgroundColor: color ? color : '#1f1f1f1f',
                    top: reveal ? '-3rem' : '0.2rem'
                }}
            >
                <div className="relative w-full h-full flex items-center justify-center -rotate-12">
                    <div className="absolute border-2 w-[7rem] h-[7rem] rounded-full flex items-center justify-center">
                        <MdOutlineStar className="absolute top-0 font-bold" />
                        <MdOutlineStar className="absolute top-2 left-5 text-sm" />
                        <MdOutlineStar className="absolute top-2 right-5 text-sm" />
                        <MdOutlineStar className="absolute bottom-0 font-bold" />
                        <MdOutlineStar className="absolute bottom-2 left-5 text-sm" />
                        <MdOutlineStar className="absolute bottom-2 right-5 text-sm" />
                        <div className="border-2 w-[4.6rem] h-[4.6rem] rounded-full"></div>
                    </div>
                    <div
                        className="absolute flex gap-2 justify-center items-center uppercase border-2 rounded-md py-2 px-4"
                        style={{ backgroundColor: color ? color : '#1f1f1f1f' }}
                    >
                        <span className="font-bold">caso encerrado</span>
                    </div>
                </div>
            </div>
            <div className="bold text-lg w-full flex items-center">
                <div className="py-2 uppercase flex justify-center w-full">
                    {card.word}
                </div>
            </div>
        </div>
    </>
}