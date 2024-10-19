import { useState } from "react";
import { TextInput } from "../atoms/TextInput";
import Button from "../atoms/Button";
import { useParams } from 'next/navigation';
import { useTokenContext } from "../../context/token";
import AvatarSelector from "../molecules/AvatarSelector";


export default function RoomRegisterForm() {
    const { roomId } = useParams() as { roomId: string };
    const { setToken } = useTokenContext();
    const [username, setUsername] = useState<string>('');
    const [avatar, setAvatar] = useState<number>(Math.floor(Math.random() * 46) + 1);

    const handleChangeUsername = (text: string) => {
        setUsername(text)
    }

    const handleSubmit = async () => {

        if (username && roomId) {
            try {
                const response = await fetch('/api/register-in-room', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', },
                    body: JSON.stringify({ roomId, playerName: username, avatar }),
                });
                const data = await response.json();
                if (response.ok) {
                    setToken(data.token)
                }
            } catch (error) {
                console.error(error);
            }
        };
    }

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
                    <Button className="w-full py-4" onClick={handleSubmit}>
                        Entrar
                    </Button>
                </form>
            </div>
        </div>
    )
}