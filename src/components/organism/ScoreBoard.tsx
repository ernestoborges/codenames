import React from "react"
import { IoInfiniteOutline } from "react-icons/io5";

export default function ScoreBoard({
    gameState
}: {
    gameState: any
}) {

    if (gameState.winner) {
        return (
            <Container>
                <Wrapper team={gameState.winner}>
                    {`Time ${gameState.winner} venceu`}
                </Wrapper>
            </Container>
        )
    }

    return (
        <Container>
            {
                gameState.phase === 1
                    ? <Wrapper team={gameState.turn} className="flex-grow flex justify-center">
                        Spymaster escolhendo palavra-chave...
                    </Wrapper>
                    : <>
                        <Wrapper team={gameState.turn}>
                            {gameState.clue.word}
                        </Wrapper>
                        <Wrapper team={gameState.turn}>
                            {gameState.clue.number < 0
                                ? <IoInfiniteOutline />
                                : gameState.clue.number}
                        </Wrapper>
                    </>
            }
        </Container>
    )
}

function Container({ children }) {
    return (
        <div className="w-full flex justify-center gap-4">
            {children}
        </div>
    )
}

function Wrapper({
    children, team, className
}: {
    children: React.ReactNode,
    team: number,
    className?: string
}) {
    return (
        <div
            className={`border-2 py-2 px-4 flex items-center ${className}`}
            style={{
                backgroundColor: team === 1 ? '#143464' : '#b4202a'
            }}
        >
            {children}
        </div>
    )
}