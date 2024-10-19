import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TextInput } from "../atoms/TextInput";
import Button from "../atoms/Button";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { useTokenContext } from "../../context/token";
import LoadingSpin from "../atoms/LoadingSpin";
import AvatarSelector from "../molecules/AvatarSelector";


export default function RoomCreationForm() {
    const router = useRouter();
    const { setToken } = useTokenContext();
    const [username, setUsername] = useState<string>('');
    const [roomName, setRoomName] = useState<string>('');
    const [avatar, setAvatar] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleChangeUsername = (text: string) => {
        setUsername(text)
    }

    const handleChangeRoomName = (text: string) => {
        setRoomName(text)
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/create-room', {

                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({ roomName, playerName: username, avatar }),
            });
            const data = await response.json();
            if (response.ok) {
                setToken(data.token);
                router.push(`/game/codenames/${data.roomId}`);
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(()=>{
        setAvatar(Math.floor(Math.random() * 46) + 1)
    }, [])

    return (
        <div className="w-full h-dvh flex items-center justify-center">
            <div className=" bg-gray-100 p-8 rounded-lg">
                <form
                    onSubmit={(e) => { e.preventDefault() }}
                    className="flex flex-col items-center gap-8"
                >
                    <AvatarSelector index={avatar} setIndex={setAvatar} />
                    <label className="flex flex-col gap-2">
                        Nome do Jogador
                        <TextInput value={username} onchange={handleChangeUsername} />
                    </label>
                    <label className="flex flex-col gap-2">
                        Nome da Sala
                        <TextInput value={roomName} onchange={handleChangeRoomName} />
                    </label>
                    <Button disabled={isLoading} className="w-full py-4 h-16" onClick={handleSubmit}>
                        {isLoading ? <LoadingSpin /> : 'Criar Sala'}
                    </Button>
                </form>
            </div>
        </div>
    )
}