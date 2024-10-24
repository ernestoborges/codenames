import { useState } from 'react'
import { FaUserSecret } from 'react-icons/fa6'
import { HiOutlineArrowUturnUp } from 'react-icons/hi2'
import { MdOutlineStar } from 'react-icons/md'

import { useSocketContext } from '../../context/socket'
import { useTokenContext } from '../../context/token'
import { Card } from '../../types/codenames'

type GameCardProps = {
  card: Card
  operativeTurn: boolean
}

export default function GameCard({ card, operativeTurn }: GameCardProps) {
  const { socket } = useSocketContext()
  const { token } = useTokenContext()
  const [hover, setHover] = useState<boolean>(false)
  const [reveal, setReveal] = useState<boolean>(false)
  let color
  switch (card.color) {
    case 0:
      color = '#505050'
      break
    case 1:
      color = '#143464'
      break
    case 2:
      color = '#b4202a'
      break
    case 3:
      color = 'black'
      break
  }

  if (card.hidden) {
    return (
      <div
        className={`w-aut flex h-[90px] w-[154px] flex-col items-center justify-center border-4 border-white text-2xl`}
        style={{
          backgroundColor: card.color !== undefined ? color : '#9c8061'
        }}
        onClick={() => {
          if (socket)
            socket.emit('gameTip', { token, cardIndex: card.position })
        }}
      >
        <div className='flex w-full flex-grow items-start justify-between'>
          <ul className='scrollbar flex w-full flex-grow flex-wrap items-start justify-start overflow-y-auto p-1 text-sm'>
            {card.tips.map((name: string, i: number) => (
              <li key={i} className='rounded-md border px-1'>
                {name}
              </li>
            ))}
          </ul>
          {operativeTurn ? (
            <div
              className='flex cursor-pointer items-center justify-center border-b border-l border-green-500 bg-green-500 p-1 text-3xl'
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              onClick={() =>
                socket &&
                socket.emit('gameFlipCard', {
                  token,
                  cardPosition: card.position
                })
              }
            >
              {hover ? <HiOutlineArrowUturnUp /> : <FaUserSecret />}
            </div>
          ) : (
            <div className='flex items-center justify-center border-b border-l p-1 text-3xl'>
              <FaUserSecret />
            </div>
          )}
        </div>
        <div className='bold flex w-full items-center border-t-2 text-lg'>
          <div className='flex w-full justify-center py-2 uppercase'>
            {card.word}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative flex h-[90px] w-[154px] cursor-pointer items-end overflow-hidden border-4 border-white text-2xl`}
      style={{ backgroundColor: color ? color : '#1f1f1f1f' }}
      onClick={() => setReveal(!reveal)}
    >
      <div
        className='absolute flex h-full w-full items-center justify-center border-b-2 text-base transition-[top] duration-700 ease-in-out'
        style={{
          backgroundColor: color ? color : '#1f1f1f1f',
          top: reveal ? '-3rem' : '0.2rem'
        }}
      >
        <div className='relative flex h-full w-full -rotate-12 items-center justify-center'>
          <div className='absolute flex h-[7rem] w-[7rem] items-center justify-center rounded-full border-2'>
            <MdOutlineStar className='absolute top-0 font-bold' />
            <MdOutlineStar className='absolute left-5 top-2 text-sm' />
            <MdOutlineStar className='absolute right-5 top-2 text-sm' />
            <MdOutlineStar className='absolute bottom-0 font-bold' />
            <MdOutlineStar className='absolute bottom-2 left-5 text-sm' />
            <MdOutlineStar className='absolute bottom-2 right-5 text-sm' />
            <div className='h-[4.6rem] w-[4.6rem] rounded-full border-2'></div>
          </div>
          <div
            className='absolute flex items-center justify-center gap-2 rounded-md border-2 px-4 py-2 uppercase'
            style={{ backgroundColor: color ? color : '#1f1f1f1f' }}
          >
            <span className='font-bold'>caso encerrado</span>
          </div>
        </div>
      </div>
      <div className='bold flex w-full items-center text-lg'>
        <div className='flex w-full justify-center py-2 uppercase'>
          {card.word}
        </div>
      </div>
    </div>
  )
}
