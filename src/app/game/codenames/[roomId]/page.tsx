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
  board: string[]
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
    board: []
  });

  const [spymasterCards, setSpymasterCards] = useState([]);

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

      socket.on('roomState', ({ players, name, gameState }) => {
        setPlayers(players);
        setRoomName(name);
        setGameState(gameState);
      })

      socket.on('spymasterCards', (cards) => {
        setSpymasterCards(cards);
      });



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
        <p>Espectadores</p>
        <ul>
          {
            players.filter(player => player.team === "0").map(player =>
              <li key={player.id}>
                <PlayerLabel name={player.username} isOnline={true} isAdmin={player.admin} />
              </li>
            )
          }
        </ul>
      </div>
      <div className='flex gap-4 items-start'>
        <div className='flex flex-col items-center min-w-[15rem] max-w-[20rem] gap-4'>
          <GameTeamSection players={players} team={1} />
          <GameTeamSection players={players} team={2} />
        </div>
        <div>
          <GameBoard cards={gameState.board} spymasterCards={spymasterCards} />
        </div>
        <div>
          <Chat />
        </div>
      </div>

    </div>
  );
}