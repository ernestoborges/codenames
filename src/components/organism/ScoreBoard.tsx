import React from "react"
import { IoInfiniteOutline } from "react-icons/io5";

export default function ScoreBoard({
    gameState
}: {
    gameState: any
}) {
    return (
        <>
            <div
                className="w-full flex justify-center gap-4"
            >
                {
                    gameState.phase === 1
                        ? <Wrapper turn={gameState.turn} className="flex-grow flex justify-center">
                            Spymaster escolhendo palavra-chave...
                        </Wrapper>
                        : <>
                            <Wrapper turn={gameState.turn}>
                                {gameState.clue.word}
                            </Wrapper>
                            <Wrapper turn={gameState.turn}>
                                {gameState.clue.number < 0
                                    ? <IoInfiniteOutline />
                                    : gameState.clue.number}
                            </Wrapper>
                        </>
                }
            </div >
        </>
    )
}

function Wrapper({
    children, turn, className
}: {
    children: React.ReactNode,
    turn: number,
    className?: string
}) {
    return <>
        <div
            className={`border-2 py-2 px-4 flex items-center ${className}`}
            style={{
                backgroundColor: turn === 1 ? '#143464' : '#b4202a'
            }}
        >
            {children}
        </div>
    </>
}