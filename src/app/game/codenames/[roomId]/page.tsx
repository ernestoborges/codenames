'use client'
import { ChangeEvent, useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import useSocket from '../../../../hooks/useSocket';
import Button from '../../../../components/atoms/Button';
import PlayerLabel from '../../../../components/molecules/PlayerLabel';
import GameTeamSection from '../../../../components/organism/GameTeamSection';
import Chat from '../../../../components/organism/Chat';
import GameBoard from '../../../../components/organism/GameBoard';

interface Player {
  id: string;
  username: string;
  team: string;
  role: string;
  admin: boolean;
}

interface GameState {
  turn: number,
  clue: {
    word: string,
    number: number
  },
  board: string[],
  teamsScore: {
    team1: number,
    team2: number
  },
}


export default function Room() {

  const { roomId } = useParams();
  const { socket, connected, token, updateToken } = useSocket();

  const [roomName, setRoomName] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [username, setUsername] = useState<string>("");
  const [checkin, setCheckin] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameState>({
    turn: 1,
    clue: {
      word: '',
      number: 0
    },
    board: [],
    teamsScore: {
      team1: 0,
      team2: 0
    },
  });

  const [clueWordInput, setClueWordInput] = useState<string>('');
  const [clueNumberInput, setClueNumberInput] = useState<number>(0);

  const handleJoinRoom = () => {
    if (socket && username) {
      socket.emit('joinRoom', { playerName: username, roomId, token });
    }
  };

  useEffect(() => {
    if (connected && socket) {

      socket.on('allowCheckin', (isAllowed: boolean) => {
        setCheckin(isAllowed);
      })

      if (token) {
        socket.emit('joinRoom', { roomId, token });
      }

      socket.on('roomPlayers', (players) => {
        setPlayers(players);
      })

      socket.on('gameState', (gameState) => {
        if (!checkin) {
          setCheckin(true)
        }
        setGameState(gameState);
      })

      return () => {
        socket.off('roomState');
        socket.off('receiveMessage');
        socket.off('allowCheckin');
      };
    }
  }, [connected, socket]);

  if (!checkin) {
    return (
      <div>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
        <button onClick={handleJoinRoom}>Entrar</button>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sala: {roomName}</h1>
      <Button onClick={() => socket.emit('restartGame', { token })}>
        Reiniciar jogo
      </Button>
      <div className='border-white border flex flex-col p-4'>
        <span>Chance: {gameState.clue.number}</span>
        <span>Dica: {gameState.clue.word}</span>
      </div>
      <div className='border-white border flex flex-col p-4'>
        <p>Time1: {gameState.teamsScore.team1}</p>
        <p>Time2: {gameState.teamsScore.team2}</p>
      </div>
      <div className='flex gap-4 items-start'>
        <div className='flex flex-col items-center min-w-[15rem] max-w-[20rem] gap-4'>
          <GameTeamSection players={players} team={1} />
          <GameTeamSection players={players} team={2} />
        </div>
        <div>
          <GameBoard cards={gameState.board} />
          <div>
            <input value={clueWordInput} onChange={(e) => setClueWordInput(e.target.value)} />
            <select onChange={(e) => setClueNumberInput(Number(e.target.value))}>
              {Array.from({ length: 10 + 1 }, (_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
            <Button onClick={()=>socket.emit('gameClue', {token, word: clueWordInput, number: clueNumberInput})}>Dar dica</Button>
          </div>
        </div>
        <div>
          <Chat />
        </div>
      </div>

    </div>
  );
}