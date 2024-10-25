import LoadingSpin from '../atoms/loading-spin'

type PageLoadingProps = {
  text: string
}
export default function PageLoading({ text }: PageLoadingProps) {
  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <div className='flex flex-col items-center justify-center gap-4'>
        <LoadingSpin />
        <span>{text}</span>
      </div>
    </div>
  )
}
