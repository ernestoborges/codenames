'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import GameRoom from '../../../../components/templates/GameRoom'
import { SocketProvider } from '../../../../context/socket'
import { useTokenContext } from '../../../../context/token'

export default function Room() {
  const { token } = useTokenContext()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    console.log('Token atualizado:', token)
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
