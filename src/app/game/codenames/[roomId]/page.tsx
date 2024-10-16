'use client'
import { useEffect, useState } from 'react';
import GameRoom from '../../../../components/templates/GameRoom';
import RoomRegistration from '../../../../components/organism/RoomRegistration';
import { TokenProvider, useTokenContext } from '../../../../context/token';
import { SocketProvider } from '../../../../context/socket';

export default function Room() {

  const { token } = useTokenContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log('Token atualizado:', token);
    if (isLoading) {
      setIsLoading(false)
    }
  }, [token])

  if (isLoading) {
    return <div>carregando</div>
  }

  if (token) {
    return (
      <SocketProvider>
        <GameRoom />
      </SocketProvider>
    )
  }

  return <div>
    <RoomRegistration />
  </div>
  // <div>
  //   <input value={username} onChange={(e) => setUsername(e.target.value)} />
  //   <button onClick={handleJoinRoom}>Entrar</button>
  // </div>

}
