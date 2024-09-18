import { FaCrown } from "react-icons/fa";

export default function PlayerLabel({
    name,
    isOnline,
    isAdmin
}: {
    name: string
    isOnline: boolean
    isAdmin: boolean
}) {

    return <>
        <div className="flex gap-4 items-center p-4 rounded-lg bg-gray-500">
            <div className="rounded-full w-4 h-4" style={{ backgroundColor: isOnline ? "green" : "gray" }} />
            <span>{name}</span>
            {isAdmin && <FaCrown />}
        </div>
    </>
}