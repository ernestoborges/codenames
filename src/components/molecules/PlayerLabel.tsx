import { FaCrown } from "react-icons/fa";
import Image from 'next/image'
import { FaRegUser } from "react-icons/fa";

export default function PlayerLabel({
    name,
    isOnline,
    isAdmin,
    avatar,
    isPlaceholder
}: {
    name?: string
    isOnline?: boolean
    isAdmin?: boolean
    avatar?: number
    isPlaceholder?: boolean
}) {

    if (isPlaceholder) {
        return <>
            <LabelContainer className="opacity-30 bg-black">
                <div className="w-[26px] h-[26px] flex items-center justify-center border-r-2">
                    <FaRegUser />
                </div>
                <div className="italic">
                    vazio
                </div>
            </LabelContainer>
        </>
    }

    return <>
        <LabelContainer>
            <div className="relative w-[26px] h-[26px]">
                <Image fill src={`/avatars/${avatar ? avatar : 1}.png`} alt='' />
            </div>
            <div className="rounded-full w-3 h-3" style={{ backgroundColor: isOnline ? "green" : "gray" }} />
            <span>{name}</span>
            {isAdmin && <FaCrown />}
        </LabelContainer>
    </>
}

function LabelContainer({ children, className }: { children: any, className?: string }) {

    return <>
        <div
            className={`flex gap-4 items-center bg-gray-500 border-b border-t ${className}`}
        >
            {children}
        </div>
    </>
}