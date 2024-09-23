import { FaCrown } from "react-icons/fa";
import Image from 'next/image'

export default function PlayerLabel({
    name,
    isOnline,
    isAdmin,
    avatar
}: {
    name?: string
    isOnline?: boolean
    isAdmin?: boolean
    avatar?: number
}) {

    return <>
        <div 
            className="flex gap-4 items-center bg-gray-500 border-b border-t"
        >
            <Image className="" src={`/avatars/${avatar?avatar:1}.png`} width={26} height={26} alt='' />
            <div className="rounded-full w-3 h-3" style={{ backgroundColor: name ? isOnline ? "green" : "gray" : 'transparent' }} />
            <span>{name ? name : 'vazio'}</span>
            {isAdmin && <FaCrown />}
        </div>
    </>
}