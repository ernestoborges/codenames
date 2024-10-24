import { useEffect, useState } from 'react'

import { useSocketContext } from '../../context/socket'
import { useTokenContext } from '../../context/token'
import { ActionLogEvent, LogEvent } from '../../types/codenames'
import ToggleButton from '../atoms/toggle-button'
import MessageDisplay from '../molecules/message-display'

export default function LogChat() {
  const { socket, connected } = useSocketContext()
  const { token } = useTokenContext()
  const [log, setLog] = useState<LogEvent[]>([])
  const [filter, setFilter] = useState({
    all: true,
    action: false,
    player: false,
    error: false,
    system: false
  })

  useEffect(() => {
    if (socket) {
      socket.on('roomLog', (log) => {
        setLog(log)
      })
    }
  }, [socket, connected, token])

  const handleSystemLog = (event: string) => {
    switch (event) {
      case 'gameStart':
        return 'Jogo iniciado'
      case 'roomCreated':
        return 'Sala criada'
      case 'gameReset':
        return 'Partida reiniciada'
      case 'teamsReset':
        return 'Times redefinidos'
      case 'endTurn':
        return 'Turno encerrado'
      case 'gameOver':
        return 'Fim de jogo'
    }
  }

  const handlePlayerLog = (player, event: string) => {
    switch (event) {
      case 'connected':
        return 'se conectou'
      case 'disconnected':
        return 'desconectou'
      case 'changeTeamRole':
        return (
          <>
            <span className='text-[#ffffff99]'>mudou para</span>
            <div>{player.role}</div>
            <span className='text-[#ffffff99]'>no time </span>
            <div>{player.team}</div>
          </>
        )
      case 'leave':
        return 'saiu'
      case 'enteredRoom':
        return 'entrou na sala'
    }
  }

  const handleActionLog = ({
    flip,
    clue,
    endTurn
  }: Pick<ActionLogEvent, 'flip' | 'clue' | 'endTurn'>) => {
    if (flip) {
      return (
        <>
          <span className='text-[#ffffff99]'>{'virou a carta'}</span>
          <div className='rounded-lg bg-[#00000044] px-2 py-1'>{flip.word}</div>
        </>
      )
    }
    if (clue) {
      return (
        <>
          <span className='text-[#ffffff99]'>{' deu a palavra-chave: '}</span>
          <div className='rounded-lg bg-[#00000044] px-2 py-1'>{clue.word}</div>
          <div className='rounded-lg bg-[#00000044] px-2 py-1'>
            {clue.number < 0 ? '∞' : clue.number}
          </div>
        </>
      )
    }
    if (endTurn) {
      return (
        <>
          <span className='text-[#ffffff99]'>{' encerrou o turno'}</span>
        </>
      )
    }
  }

  const handleLogText = (log: LogEvent) => {
    switch (log.type) {
      case 'action':
        return (
          <>
            <div
              className={`${log.player.team === 1 ? 'bg-[#143464aa]' : 'bg-[#b4202aaa]'} flex h-full w-full items-center gap-2 break-words px-4 py-1`}
            >
              <span className='font-bold'>{log.player.username}</span>
              {handleActionLog(log)}
            </div>
          </>
        )
      case 'player':
        return (
          <>
            <div
              className={`${log.player.team === 0 ? '' : log.player.team === 1 ? 'bg-[#143464aa]' : 'bg-[#b4202aaa]'} flex h-full w-full items-center gap-2 break-words px-4 py-1`}
            >
              <span className='font-bold'>{log.player.username}</span>
              {handlePlayerLog(log.player, log.event)}
            </div>
          </>
        )
      case 'system':
        return (
          <>
            <div className='flex h-full w-full items-center gap-2 break-words px-4 py-1'>
              {handleSystemLog(log.event)}
            </div>
          </>
        )
    }
  }

  return (
    <div className='flex h-[36rem] flex-col items-center gap-4 rounded-lg border pb-4 pr-4'>
      <div className='w-full p-4'>
        <ul className='flex w-full gap-4 text-sm font-bold'>
          <li>
            <ToggleButton
              onClick={() => setFilter((prev) => ({ ...prev, all: !prev.all }))}
              value={filter.all}
            >
              tudo
            </ToggleButton>
          </li>
          <li>
            <ToggleButton
              onClick={() =>
                setFilter((prev) => ({ ...prev, action: !prev.action }))
              }
              value={filter.action}
            >
              ação
            </ToggleButton>
          </li>
          <li>
            <ToggleButton
              onClick={() =>
                setFilter((prev) => ({ ...prev, player: !prev.player }))
              }
              value={filter.player}
            >
              jogador
            </ToggleButton>
          </li>
          <li>
            <ToggleButton
              onClick={() =>
                setFilter((prev) => ({ ...prev, system: !prev.system }))
              }
              value={filter.system}
            >
              sistema
            </ToggleButton>
          </li>
        </ul>
      </div>
      <MessageDisplay className='text-base'>
        {log
          .filter((m) => {
            if (filter.all) {
              return true
            } else {
              switch (m.type) {
                case 'action':
                  return filter.action
                case 'player':
                  return filter.player
                case 'system':
                  return filter.system
              }
            }
          })
          .map((m, i) => (
            <li key={i}>{handleLogText(m)}</li>
          ))}
      </MessageDisplay>
    </div>
  )
}
