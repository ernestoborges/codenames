import { RxEnter } from 'react-icons/rx'

import { useSocketContext } from '../../context/socket'
import { useTokenContext } from '../../context/token'
import { Player } from '../../types/codenames'
import Button from '../atoms/button'
import PlayerLabel from '../molecules/player-label'

type RoomState = {
  name: string
  status: string
}

type GameTeamSectionProps = {
  players: Player[]
  team: number
  score: number
  roomState: RoomState
}

export default function GameTeamSection({
  players,
  team,
  score,
  roomState
}: GameTeamSectionProps) {
  const { socket } = useSocketContext()
  const { token } = useTokenContext()

  const me = players.find((p) => p.me)

  return (
    <>
      <div
        className={`flex w-full flex-col border-2 border-white text-2xl`}
        style={{
          backgroundColor: team === 1 ? '#143464' : '#b4202a'
        }}
      >
        <div className={`flex justify-between p-2`}>
          <p>Time {team}</p>
          <p>{score}</p>
        </div>
        <div className='flex w-full items-center justify-between bg-white text-black'>
          <p className='py-2'>Operative</p>
          {(roomState.status == 'waiting' || (me && me.role) === 'spectator') &&
            ((me && me.team !== team) || (me && me.role) !== 'operative') && (
              <>
                <Button
                  className='flex items-center p-2'
                  onClick={() => {
                    if (socket)
                      socket.emit('updateTeam', {
                        token,
                        team,
                        role: 'operative'
                      })
                  }}
                >
                  <RxEnter />
                </Button>
              </>
            )}
        </div>
        <ul>
          {players
            .filter(
              (player) => player.team === team && player.role === 'operative'
            )
            .map((player) => (
              <li key={player.id}>
                <PlayerLabel
                  name={player.username}
                  isOnline={player.connected}
                  isAdmin={player.admin}
                  avatar={player.avatar}
                />
              </li>
            ))}
          {Array.from(
            {
              length: Math.max(
                0,
                5 -
                  players.filter(
                    (player) =>
                      player.team === team && player.role === 'operative'
                  ).length
              )
            },
            (_, i) => (
              <li
                key={
                  1 +
                  i +
                  players.filter(
                    (player) =>
                      player.team === team && player.role === 'operative'
                  ).length
                }
              >
                <PlayerLabel isPlaceholder={true} />
              </li>
            )
          )}
        </ul>
        <div className='flex w-full items-center justify-between bg-white text-black'>
          <p className='py-2'>Spymaster</p>
          {(roomState.status == 'waiting' || (me && me.role) === 'spectator') &&
            ((me && me.team !== team) || (me && me.role) !== 'spymaster') && (
              <Button
                className='flex items-center p-2'
                onClick={() => {
                  if (socket)
                    socket.emit('updateTeam', {
                      token,
                      team,
                      role: 'spymaster'
                    })
                }}
              >
                <RxEnter />
              </Button>
            )}
        </div>
        <ul>
          {players
            .filter(
              (player) => player.team === team && player.role === 'spymaster'
            )
            .map((player) => (
              <li key={player.id}>
                <PlayerLabel
                  name={player.username}
                  isOnline={player.connected}
                  isAdmin={player.admin}
                  avatar={player.avatar}
                />
              </li>
            ))}
          {Array.from(
            {
              length: Math.max(
                0,
                2 -
                  players.filter(
                    (player) =>
                      player.team === team && player.role === 'spymaster'
                  ).length
              )
            },
            (_, i) => (
              <li
                key={
                  1 +
                  i +
                  players.filter(
                    (player) =>
                      player.team === team && player.role === 'spymaster'
                  ).length
                }
              >
                <PlayerLabel isPlaceholder={true} />
              </li>
            )
          )}
        </ul>
      </div>
    </>
  )
}
