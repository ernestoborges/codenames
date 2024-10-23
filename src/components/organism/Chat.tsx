import { useEffect, useState } from 'react'
import { IoMdSend } from 'react-icons/io'

import { useSocketContext } from '../../context/socket'
import { useTokenContext } from '../../context/token'
import MessageDisplay from '../molecules/MessageDisplay'

interface Message {
  sender: string
  me: boolean
  message: string
  timestamp: string
}

export default function Chat() {
  const { socket, connected } = useSocketContext()
  const { token } = useTokenContext()
  const [chat, setChat] = useState<Message[]>([])
  const [message, setMessage] = useState<string>('')

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (socket && message && token) {
      socket.emit('sendMessage', { token, message })
      setMessage('')
    }
  }

  useEffect(() => {
    if (socket) {
      socket.on('chatUpdate', (newChat: Message[]) => {
        setChat(newChat)
      })
    }
  }, [socket, connected])

  return (
    <div className='flex h-[20rem] flex-col items-center gap-4 rounded-lg border p-4'>
      <MessageDisplay className='text-lg'>
        {chat.map((c, i) => (
          <li key={i}>
            <div className='break-words'>
              <span className='font-bold'>{c.sender}</span>:{' '}
              <span className='text-[#f0f0f0f0]'>{c.message}</span>
            </div>
          </li>
        ))}
      </MessageDisplay>
      <form className='flex w-full bg-white' onSubmit={handleSendMessage}>
        <input
          className='w-full px-4 py-1 text-2xl text-black'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className='flex w-16 items-center justify-center text-black'>
          <IoMdSend />
        </button>
      </form>
    </div>
  )
}
