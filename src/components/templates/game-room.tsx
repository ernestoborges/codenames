import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { IoIosClose } from 'react-icons/io'

import { useSocketContext } from '../../context/socket'
import { useTokenContext } from '../../context/token'
import { GameState, Player, RoomState } from '../../types/codenames'
import Button from '../atoms/button'
import ClueInput from '../molecules/clue-input'
import Chat from '../organism/chat'
import GameBoard from '../organism/game-board'
import GameTeamSection from '../organism/game-team-section'
import LogChat from '../organism/log-chat'
import ScoreBoard from '../organism/score-board'

export default function GameRoom() {
  const { socket, connected } = useSocketContext()
  const { token } = useTokenContext()
  const { roomId } = useParams() as { roomId: string }
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const [players, setPlayers] = useState<Player[]>([])
  const [roomState, setRoomState] = useState<RoomState | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)

  useEffect(() => {
    if (socket && connected) {
      socket.on('roomPlayers', (players) => {
        setPlayers(players)
      })

      socket.on('gameState', (gameState) => {
        setGameState(gameState)
      })

      socket.on('roomState', (roomState) => {
        setRoomState(roomState)
      })

      if (isLoading) {
        socket.emit('joinRoom')
        setIsLoading(false)
      }

      return () => {
        // socket.off('roomState');
        // socket.off('receiveMessage');
        // socket.off('allowCheckin');
      }
    }
  }, [socket, connected, isLoading])

  if (isLoading) {
    return (
      <>
        <div>calma po</div>
      </>
    )
  }

  if (!roomState || !gameState || !players) {
    return <div>carregando</div>
  }

  return (
    <div
      className='flex h-screen items-center justify-center p-4'
      style={{
        backgroundImage: 'linear-gradient(0deg, #1a1a1a1a 50%, #3a3a3a3a 50%)',
        backgroundSize: '10px 10px'
      }}
    >
      <div className='flex items-stretch justify-center gap-3'>
        <div className='flex w-[25rem] flex-col items-center gap-4'>
          <GameTeamSection
            players={players}
            team={1}
            score={gameState.teamsScore.team1}
            roomState={roomState}
          />
          <GameTeamSection
            players={players}
            team={2}
            score={gameState.teamsScore.team2}
            roomState={roomState}
          />
        </div>
        <div>
          {roomState.status === 'waiting' ? (
            <div className='flex h-full w-[79rem] items-center justify-center'>
              <div className='flex flex-col gap-4 rounded-sm bg-gray-100 p-4'>
                <div className='p-8'>Esperando jogadores</div>
                <div className='flex gap-4'>
                  <Button
                    onClick={() =>
                      socket && socket.emit('gameResetTeams', { token })
                    }
                  >
                    Reiniciar Time
                  </Button>
                  <Button
                    onClick={() =>
                      socket && socket.emit('startGame', { token, roomId })
                    }
                  >
                    Iniciar Jogo
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className='flex flex-col items-center gap-4'>
              <ScoreBoard gameState={gameState} />
              <GameBoard
                cards={gameState.board}
                operativeTurn={gameState.operativeTurn}
              />
              {gameState.spymasterTurn && <ClueInput gameState={gameState} />}
              {gameState.operativeTurn && (
                <Button
                  className='px-4'
                  onClick={() =>
                    socket && socket.emit('gameEndTurn', { token })
                  }
                >
                  Encerrar turno
                </Button>
              )}
            </div>
          )}
        </div>
        <div className='flex w-[24rem] flex-col gap-4'>
          <div className='flex justify-end gap-4'>
            {players.find((p) => p.me)?.admin && (
              <Button
                onClick={() => socket && socket.emit('restartGame', { token })}
              >
                Reiniciar jogo
              </Button>
            )}
            <Button
              onClick={() => socket && socket.emit('leaveRoom')}
              className='border-red bg-transparent text-red hover:bg-red hover:text-white'
            >
              <IoIosClose size={24} />
            </Button>
          </div>
          <LogChat />
          <Chat />
        </div>
      </div>
    </div>
  )
}
