'use client'
import { useEffect, useRef, useState } from "react"
import Button from "../atoms/Button"
import { useRouter } from "next/navigation"
import AvatarSelector from "../molecules/AvatarSelector"
import { TextInput } from "../atoms/TextInput"
import { useTokenContext } from "../../context/token"
import { TbRefresh } from "react-icons/tb";
import LoadingSpin from "../atoms/LoadingSpin"

export default function Lobby() {

    const router = useRouter()
    const { token, setToken } = useTokenContext()
    const [rooms, setRooms] = useState<{ name: string, id: string, players: string, status: string }[]>([])
    const [username, setUsername] = useState<string>('')
    const [roomName, setRoomName] = useState<string>('')
    const [avatar, setAvatar] = useState<number>(Math.floor(Math.random() * 46) + 1)
    const [selectedRoom, setSelectedRoom] = useState<number>(-1)

    const [isLoading, setIsLoading] = useState({
        registration: false,
        creation: false
    })

    const roomListRef = useRef<HTMLTableSectionElement | null>(null);
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
        Object.keys(isLoading).forEach(item => {
            if (isLoading[item])
                return true
        })
        return false
    }

    const handleRefreshRooms = async () => {
        try {
            const response = await fetch('/api/rooms', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', }
            });
            const data = await response.json();
            if (response.ok) {
                setRooms(data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const target = event.nativeEvent as SubmitEvent;
        const buttonClicked = (target.submitter as HTMLButtonElement).name;

        if (buttonClicked === 'enterRoom') {
            if (!isAnyLoading() && username) {
                try {
                    setIsLoading((prev) => ({ ...prev, registration: true }))
                    const response = await fetch('/api/register-in-room', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', },
                        body: JSON.stringify({ playerName: username, avatar, roomId: rooms[selectedRoom]?.id, token }),
                    });
                    const data = await response.json();
                    if (response.ok) {
                        setToken(data.token)
                        router.push(`/game/codenames/${data.roomId}`);
                    }
                    setIsLoading((prev) => ({ ...prev, registration: false }))
                } catch (error) {
                    console.error(error);
                }
            };
        } else if (buttonClicked === 'createRoom') {
            if (!isAnyLoading() && username && roomName) {
                try {
                    setIsLoading((prev) => ({ ...prev, creation: true }))
                    const response = await fetch('/api/create-room', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', },
                        body: JSON.stringify({ roomName, playerName: username, avatar }),
                    });
                    const data = await response.json();
                    if (response.ok) {
                        setToken(data.token);
                        router.push(`/game/codenames/${data.roomId}`);
                    }
                    setIsLoading((prev) => ({ ...prev, creation: false }))
                } catch (error) {
                    console.error(error);
                }
            };
        }
    }

    useEffect(() => {

        handleRefreshRooms()

        const handleClickOutside = (event: MouseEvent) => {
            if (
                roomListRef.current
                && !roomListRef.current.contains(event.target as Node)
                && cardRef.current
                && !cardRef.current.contains(event.target as Node)
            ) {
                setSelectedRoom(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="w-full h-dvh flex gap-8 items-center justify-center">
            <div ref={cardRef} className="h-dvh flex items-center justify-center">
                <div className=" bg-gray-100 p-8 rounded-lg">
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col items-center gap-8"
                    >
                        <AvatarSelector index={avatar} setIndex={setAvatar} />
                        <label className="flex flex-col gap-2">
                            Nome do Jogador
                            <TextInput value={username} onchange={handleChangeUsername} />
                        </label>
                        <hr className="w-full h-0 border-t border-gray-300" />
                        <Button
                            type='submit'
                            className="w-full py-4"
                            name="enterRoom"
                            disabled={isAnyLoading() || !username || selectedRoom < 0}
                        >
                            {isLoading['registration'] ? <LoadingSpin /> : "Entrar"}
                        </Button>
                        <div className="flex gap-2 w-full items-center">
                            <hr className="w-full h-0 border-t border-gray-300" />
                            <div className="text-gray-300">ou</div>
                            <hr className="w-full h-0 border-t border-gray-300" />
                        </div>
                        <label className="flex flex-col gap-2">
                            Nome da Sala
                            <TextInput value={roomName} onchange={handleChangeRoomName} />
                        </label>
                        <Button
                            type='submit'
                            className="w-full py-4"
                            name="createRoom"
                            disabled={isAnyLoading() || !roomName || !username}
                        >
                            {isLoading['creation'] ? <LoadingSpin /> : "Criar Sala"}
                        </Button>
                    </form>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <div className="w-full flex justify-end">
                    <Button onClick={handleRefreshRooms}>
                        <TbRefresh size={25} />
                    </Button>
                </div>
                <div className="min-w-[60rem] bg-gray-100 rounded-lg overflow-hidden">
                    <div className="overflow-auto h-[30rem]">
                        <table className="border-collapse w-full">
                            <thead>
                                <tr>
                                    <th className="bg-gray sticky top-0 z-1 px-6 py-3 text-left">Nome da Sala</th>
                                    <th className="bg-gray sticky top-0 z-1 px-6 py-3">Jogadores</th>
                                    <th className="bg-gray sticky top-0 z-1 px-6 py-3">status</th>
                                </tr>
                            </thead>
                            <tbody ref={roomListRef}>
                                {
                                    rooms.map((room, i) => (
                                        <tr
                                            key={i}
                                            className={`h-4 cursor-pointer border-y border-gray ${i === selectedRoom ? "bg-green-500 hover:bg-green-400" : "hover:bg-gray-200"}`}
                                            onClick={() => handleSelectRoom(i)}
                                        >
                                            <td className="px-6 py-3">{room.name}</td>
                                            <td className="px-6 py-3 text-center">{room.players}</td>
                                            <td className="px-6 py-3 text-center">{room.status}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div >
    )
}
