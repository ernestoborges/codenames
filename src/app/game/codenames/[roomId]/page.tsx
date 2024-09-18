'use client'
import { ChangeEvent, useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import useSocket from '../../../../hooks/useSocket';
import Button from '../../../../components/atoms/Button';
import PlayerLabel from '../../../../components/molecules/PlayerLabel';

interface Player {
  id: string;
  username: string;
  team: string;
  role: string;
  admin: boolean;
}

interface Message {
  username: string,
  message: string,
  timestamp: string
}

export default function Room() {
  const router = useRouter();
  const { roomId } = useParams();
  const searchParams = useSearchParams();

  const { socket, connected } = useSocket(roomId[0] || '');

  const [roomName, setRoomName] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [username, setUsername] = useState<string>("");
  const [chat, setChat] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [checkin, setCheckin] = useState<boolean>(false);
  const [isNameRequired, setIsNameRequired] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');

  const handleSendMessage = () => {
    if (socket && message && token) {
      socket.emit('sendMessage', { roomId, token, message });
      setMessage('');
    }
  }

  const handleJoinRoom = () => {
    if (socket && username) {
      const token = localStorage.getItem('token') || '';
      setToken(token);
      socket.emit('joinRoom', { playerName: username, roomId, token });
      // socket.emit('createRoom', { playerName: username, roomName: "testanto2" });
    }
  };

  // useEffect(() => {
  //   if (socket && checkin) {
  //     socket.emit('joinRoom', { roomName, playerName: username });
  //   }
  // }, [checkin])

  useEffect(() => {
    if (connected && socket) {
      socket.on('allowCheckin', (isAllowed: boolean) => {
        setCheckin(isAllowed);
      });

      const token = localStorage.getItem('token');
      if (token) {
        socket.emit('joinRoom', { roomId, token });
      }

      socket.on('roomState', ({ players, name, gameState }) => {
        setPlayers(players)
        setRoomName(name);
      })

      socket.on('token', (token) => {
        setToken(token);
      })

      socket.on('usersInRoom', (users: Player[]) => {
        console.log("cheguei")
        setPlayers(users);
      });
    }
  }, [connected, socket]);

  useEffect(() => {

    if (socket && roomId) {

      socket.on('usersInRoom', (users: Player[]) => {
        setPlayers(users);
      });

      socket.on('receiveMessage', (newMessage: Message) => {
        setChat((prevChat) => [...prevChat, newMessage]);
      });

      return () => {
        socket.off('usersInRoom');
        socket.off('chatMessage');
        // socket.off('allowCheckin');
      };
    }
  }, [socket, roomId]);

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
      <div className='border-white border flex flex-col p-4'>
        <p>Time 1</p>
        <p>Operative</p>
        <ul>
          {
            players.filter(player => player.team === "1" && player.role === 'operative').map(player =>
              <li key={player.id}>
                <PlayerLabel name={player.username} isOnline={true} isAdmin={player.admin} />
              </li>
            )
          }
        </ul>
        <Button onClick={() => {
          socket.emit('updateTeam', { token, team: "1", role: 'operative' })
        }}>Entrar Operative</Button>
        <p>Spymaster</p>
        <ul>
          {
            players.filter(player => player.team === "1" && player.role === 'spymaster').map(player =>
              <li key={player.id}>
                <PlayerLabel name={player.username} isOnline={true} isAdmin={player.admin} />
              </li>
            )
          }
        </ul>
        <Button onClick={() => {
          socket.emit('updateTeam', { token, team: "1", role: 'spymaster' })
        }}>Entrar Spymaster</Button>
      </div>
      <div className='border-white border flex flex-col p-4'>
        <p>Time 2</p>
        <p>Operative</p>
        <ul>
          {
            players.filter(player => player.team === "2" && player.role === 'operative').map(player =>
              <li key={player.id}>
                <PlayerLabel name={player.username} isOnline={true} isAdmin={player.admin} />
              </li>
            )
          }
        </ul>
        <Button onClick={() => {
          socket.emit('updateTeam', { token, team: "2", role: 'operative' })
        }}>Entrar Operative</Button>
        <p>Spymaster</p>
        <ul>
          {
            players.filter(player => player.team === "2" && player.role === 'spymaster').map(player =>
              <li key={player.id}>
                <PlayerLabel name={player.username} isOnline={true} isAdmin={player.admin} />
              </li>
            )
          }
        </ul>
        <Button onClick={() => {
          socket.emit('updateTeam', { token, team: "2", role: 'spymaster' })
        }}>Entrar Spymaster</Button>
      </div>
      <input className='text-black'
        value={message} onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send Message</button>
      <ul>
        {
          chat.map((c, i) =>
            <li key={i}>
              <div>{c.username}</div>
              <div>{c.message}</div>
            </li>
          )
        }
      </ul>
    </div>
  );
}