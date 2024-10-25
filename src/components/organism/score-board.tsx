import React from 'react'
import { IoInfiniteOutline } from 'react-icons/io5'

import { GameState } from '../../types/codenames'

type ScoreBoardProps = {
  gameState: GameState
}

type ContainerProps = {
  children: React.ReactNode
}

type WrapperProps = {
  children: React.ReactNode
  team: number
  className?: string
}

export default function ScoreBoard({ gameState }: ScoreBoardProps) {
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
      {gameState.phase === 1 ? (
        <Wrapper
          team={gameState.turn}
          className='flex flex-grow justify-center'
        >
          Spymaster escolhendo palavra-chave...
        </Wrapper>
      ) : (
        <>
          <Wrapper team={gameState.turn}>{gameState.clue.word}</Wrapper>
          <Wrapper team={gameState.turn}>
            {gameState.clue.number < 0 ? (
              <IoInfiniteOutline />
            ) : (
              gameState.clue.number
            )}
          </Wrapper>
        </>
      )}
    </Container>
  )
}

function Container({ children }: ContainerProps) {
  return <div className='flex w-full justify-center gap-4'>{children}</div>
}

function Wrapper({ children, team, className }: WrapperProps) {
  return (
    <div
      className={`flex items-center border-2 px-4 py-2 ${className}`}
      style={{
        backgroundColor: team === 1 ? '#143464' : '#b4202a'
      }}
    >
      {children}
    </div>
  )
}
