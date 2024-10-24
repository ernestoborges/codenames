import Image from 'next/image'
import { FaCrown, FaRegUser } from 'react-icons/fa'

type PlayerLabelProps = {
  name?: string
  isOnline?: boolean
  isAdmin?: boolean
  avatar?: number
  isPlaceholder?: boolean
}

type LabelContainerProps = {
  children: React.ReactNode
  className?: string
}

export default function PlayerLabel({
  name,
  isOnline,
  isAdmin,
  avatar,
  isPlaceholder
}: PlayerLabelProps) {
  if (isPlaceholder) {
    return (
      <LabelContainer className='bg-black opacity-30'>
        <div className='flex h-[26px] w-[26px] items-center justify-center border-r-2'>
          <FaRegUser />
        </div>
        <div className='italic'>vazio</div>
      </LabelContainer>
    )
  }

  return (
    <LabelContainer>
      <div className='relative h-[26px] w-[26px]'>
        <Image fill src={`/avatars/${avatar ? avatar : 1}.png`} alt='' />
      </div>
      <div
        className={`h-4 w-4 rounded-full border border-green-500 ${isOnline ? 'bg-green-500' : 'transparent'}`}
      />
      <span>{name}</span>
      {isAdmin && <FaCrown />}
    </LabelContainer>
  )
}

function LabelContainer({ children, className }: LabelContainerProps) {
  return (
    <div
      className={`bg-gray-500 flex items-center gap-4 border-b border-t ${className}`}
    >
      {children}
    </div>
  )
}
