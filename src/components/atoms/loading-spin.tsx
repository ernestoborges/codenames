import { LuLoader } from 'react-icons/lu'

type LoadingSpinProps = {
  size?: number
}
export default function LoadingSpin({ size = 16 }: LoadingSpinProps) {
  return <LuLoader size={size} className='animate-spin' />
}
