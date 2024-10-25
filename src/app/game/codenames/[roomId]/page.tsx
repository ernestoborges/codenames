'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import PageLoading from '../../../../components/molecules/page-loading'
import GameRoom from '../../../../components/templates/game-room'
import { SocketProvider } from '../../../../context/socket'
import { useTokenContext } from '../../../../context/token'

export default function Room() {
  const { token } = useTokenContext()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    if (isLoading) {
      setIsLoading(false)
    }
  }, [token])

  if (isLoading) {
    return <PageLoading text='Carregando Página' />
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
