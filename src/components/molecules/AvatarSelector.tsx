import Image from 'next/image'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

import { MAX_AVATARS } from '../../conf/codenames.conf'
import Button from '../atoms/Button'
import LoadingSpin from '../atoms/LoadingSpin'

export default function AvatarSelector({
  index,
  setIndex
}: {
  index: number
  setIndex: (n: number) => void
}) {
  const handlePreviousAvatar = () => {
    if (index - 1 < 1) {
      setIndex(MAX_AVATARS)
    } else {
      setIndex(index - 1)
    }
  }

  const handleNextAvatar = () => {
    if (index + 1 > MAX_AVATARS) {
      setIndex(1)
    } else {
      setIndex(index + 1)
    }
  }
  console.log('avatar:', index)

  return (
    <div className='flex flex-col gap-4'>
      <div className='relative flex h-[16rem] w-[16rem] items-center justify-center overflow-hidden rounded-xl border-2 border-white'>
        {index ? (
          <Image src={`/avatars/${index}.png`} alt='' fill />
        ) : (
          <LoadingSpin />
        )}
      </div>
      <div className='flex gap-4'>
        <Button
          className='grow px-4 py-2 text-3xl'
          onClick={handlePreviousAvatar}
        >
          <IoIosArrowBack />
        </Button>
        <Button className='grow px-4 py-2 text-3xl' onClick={handleNextAvatar}>
          <IoIosArrowForward />
        </Button>
      </div>
    </div>
  )
}
