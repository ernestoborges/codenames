'use client'
import { useEffect, useState } from 'react';
import GameRoom from '../../../../components/templates/GameRoom';
import { useTokenContext } from '../../../../context/token';
import { SocketProvider } from '../../../../context/socket';
import { useRouter } from 'next/navigation';

export default function Room() {

  const { token } = useTokenContext();
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log('Token atualizado:', token);
    if (isLoading) {
      setIsLoading(false)
    }
  }, [token, isLoading])

  if (isLoading) {
    return <div>carregando</div>
  }

  if (!token) {
    router.push('/')
  }

  return (
    <SocketProvider>
      <GameRoom />
    </SocketProvider>
  )
}
