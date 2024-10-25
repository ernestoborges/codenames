'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TbRefresh } from 'react-icons/tb'

import { useTokenContext } from '../../context/token'
import Button from '../atoms/button'
import { Input } from '../atoms/input'
import AvatarSelector from '../molecules/avatar-selector'
import TextButton from '../molecules/text-button'

export default function Lobby() {
  const router = useRouter()
  const { token, setToken } = useTokenContext()
  const [rooms, setRooms] = useState<
    { name: string; id: string; players: string; status: string }[]
  >([])
  const [username, setUsername] = useState<string>('')
  const [roomName, setRoomName] = useState<string>('')
  const [avatar, setAvatar] = useState<number>(
    Math.floor(Math.random() * 46) + 1
  )
  const [selectedRoom, setSelectedRoom] = useState<number>(-1)

  const [isLoading, setIsLoading] = useState({
    registration: false,
    creation: false
  })

  const roomListRef = useRef<HTMLTableSectionElement | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)

  const handleChangeUsername = (text: string) => {
    setUsername(text)
  }

  const handleChangeRoomName = (text: string) => {
    setRoomName(text)
  }

  const handleSelectRoom = (roomIndex: number) => {
    setSelectedRoom(roomIndex)
  }

  const isAnyLoading = () => {
    Object.keys(isLoading).forEach((item) => {
      if (isLoading[item]) return true
    })
    return false
  }

  const handleRefreshRooms = async () => {
    try {
      const response = await fetch('/api/rooms', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await response.json()
      if (response.ok) {
        setRooms(data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const target = event.nativeEvent as SubmitEvent
    const buttonClicked = (target.submitter as HTMLButtonElement).name

    if (buttonClicked === 'enterRoom') {
      if (!isAnyLoading() && username) {
        try {
          setIsLoading((prev) => ({ ...prev, registration: true }))
          const response = await fetch('/api/register-in-room', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              playerName: username,
              avatar,
              roomId: rooms[selectedRoom]?.id,
              token
            })
          })
          const data = await response.json()
          if (response.ok) {
            setToken(data.token)
            router.push(`/game/codenames/${data.roomId}`)
          }
          setIsLoading((prev) => ({ ...prev, registration: false }))
        } catch (error) {
          console.error(error)
        }
      }
    } else if (buttonClicked === 'createRoom') {
      if (!isAnyLoading() && username && roomName) {
        try {
          setIsLoading((prev) => ({ ...prev, creation: true }))
          const response = await fetch('/api/create-room', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              roomName,
              playerName: username,
              avatar,
              token
            })
          })
          const data = await response.json()
          if (response.ok) {
            setToken(data.token)
            router.push(`/game/codenames/${data.roomId}`)
          }
          setIsLoading((prev) => ({ ...prev, creation: false }))
        } catch (error) {
          console.error(error)
        }
      }
    }
  }

  useEffect(() => {
    handleRefreshRooms()

    const handleClickOutside = (event: MouseEvent) => {
      if (
        roomListRef.current &&
        !roomListRef.current.contains(event.target as Node) &&
        cardRef.current &&
        !cardRef.current.contains(event.target as Node)
      ) {
        setSelectedRoom(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className='flex h-dvh w-full items-center justify-center gap-8'>
      <div ref={cardRef} className='flex h-dvh items-center justify-center'>
        <div className='rounded-lg bg-gray-100 p-8'>
          <form
            onSubmit={handleSubmit}
            className='flex flex-col items-center gap-8'
          >
            <AvatarSelector index={avatar} setIndex={setAvatar} />
            <label className='flex flex-col gap-2'>
              Nome do Jogador
              <Input value={username} onchange={handleChangeUsername} />
            </label>
            <hr className='h-0 w-full border-t border-gray-300' />
            <TextButton
              title='Entrar'
              type='submit'
              className='w-full py-4'
              name='enterRoom'
              isLoading={isLoading['registration']}
              disabled={isAnyLoading() || !username || selectedRoom < 0}
            />
            <div className='flex w-full items-center gap-2'>
              <hr className='h-0 w-full border-t border-gray-300' />
              <div className='text-gray-300'>ou</div>
              <hr className='h-0 w-full border-t border-gray-300' />
            </div>
            <label className='flex flex-col gap-2'>
              Nome da Sala
              <Input value={roomName} onchange={handleChangeRoomName} />
            </label>
            <TextButton
              title='Criar Sala'
              type='submit'
              className='w-full py-4'
              name='createRoom'
              isLoading={isLoading['creation']}
              disabled={isAnyLoading() || !roomName || !username}
            />
          </form>
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <div className='flex w-full justify-end'>
          <Button onClick={handleRefreshRooms}>
            <TbRefresh size={25} />
          </Button>
        </div>
        <div className='min-w-[60rem] overflow-hidden rounded-lg bg-gray-100'>
          <div className='h-[30rem] overflow-auto'>
            <table className='w-full border-collapse'>
              <thead>
                <tr>
                  <th className='z-1 sticky top-0 bg-gray px-6 py-3 text-left'>
                    Nome da Sala
                  </th>
                  <th className='z-1 sticky top-0 bg-gray px-6 py-3'>
                    Jogadores
                  </th>
                  <th className='z-1 sticky top-0 bg-gray px-6 py-3'>status</th>
                </tr>
              </thead>
              <tbody ref={roomListRef}>
                {rooms.map((room, i) => (
                  <tr
                    key={i}
                    className={`h-4 cursor-pointer border-y border-gray ${i === selectedRoom ? 'bg-green-500 hover:bg-green-400' : 'hover:bg-gray-200'}`}
                    onClick={() => handleSelectRoom(i)}
                  >
                    <td className='px-6 py-3'>{room.name}</td>
                    <td className='px-6 py-3 text-center'>{room.players}</td>
                    <td className='px-6 py-3 text-center'>{room.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
