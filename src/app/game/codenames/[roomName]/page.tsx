'use client'
import { ChangeEvent, useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import useSocket from '@/hooks/useSocket';
import { TextInput } from '@/components/atoms/TextInput';

interface User {
  id: string;
  name: string;
}

interface Message {
  user: string,
  text: string
}

export default function Room() {
  const router = useRouter();
  const { roomName } = useParams();
  const searchParams = useSearchParams();

  const { socket, connected } = useSocket(roomName[0] || '');

  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState<string>("");
  const [chat, setChat] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [checkin, setCheckin] = useState<boolean>(false);
  const [isNameRequired, setIsNameRequired] = useState<boolean>(false);

  const handleSendMessage = () => {
    if (socket && message) {
      socket.emit('sendMessage', { roomName, user: socket.id, text: message });
      setMessage('');
    }
  }

  const handleJoinRoom = () => {
    if (socket && username) {
      console.log(roomName)
      socket.emit('setUsername', { username, roomId: roomName });
    }
  };

  useEffect(() => {
    if (socket && checkin) {
      socket.emit('joinRoom', { roomName, playerName: username });
    }
  }, [checkin])

  useEffect(() => {
    if (connected && socket) {
      socket.on('allowCheckin', (isAllowed: boolean) => {
          setCheckin(isAllowed);
      });

      socket.on('usersInRoom', (users: User[]) => {
        console.log("cheguei")
        setUsers(users);
      });
    }
  }, [connected, socket]);

  useEffect(() => {

    if (socket && roomName) {

      socket.on('usersInRoom', (users: User[]) => {
        setUsers(users);
      });

      socket.on('chatMessage', (newMessage: Message) => {
        setChat((prevChat) => [...prevChat, newMessage]);
      });

      // socket.on('allowCheckin', (allowCheckin: boolean) => {
      //   console.log("olha eu ai");
      //   setCheckin(allowCheckin);
      // });

      return () => {
        socket.off('usersInRoom');
        socket.off('chatMessage');
        // socket.off('allowCheckin');
      };
    }
  }, [socket, roomName]);

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
      <button onClick={() => socket && socket.emit('getUsersInRoom', {roomName, user: username})}>refresh users</button>
      <h1 className="text-2xl font-bold mb-4">Sala: {roomName}</h1>
      <h2 className="text-xl font-semibold mb-2">Usuários Online:</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="mb-1">
            {user.name}
          </li>
        ))}
      </ul>
      <input className='text-black'
        value={message} onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send Message</button>
      <ul>
        {
          chat.map((c, i) =>
            <li key={i}>
              <div>{c.user}</div>
              <div>{c.text}</div>
            </li>
          )
        }
      </ul>
    </div>
  );
}