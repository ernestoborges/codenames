import { Dispatch, SetStateAction, useState } from "react";
import { TextInput } from "../atoms/TextInput";
import Image from 'next/image'
import Button from "../atoms/Button";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useParams } from 'next/navigation';
import { useTokenContext } from "../../context/token";


export default function RoomRegisterForm() {
    const { roomId } = useParams() as { roomId: string };
    const { setToken } = useTokenContext();
    const [username, setUsername] = useState<string>('');
    const [avatar, setAvatar] = useState<number>(Math.floor(Math.random() * 46) + 1);

    const handleChangeUsername = (text: string) => {
        setUsername(text)
    }

    const handlePreviousAvatar = () => {
        if (avatar - 1 < 1) {
            setAvatar(47)
        } else {
            setAvatar(avatar - 1)
        }
    }

    const handleNextAvatar = () => {
        if (avatar + 1 > 47) {
            setAvatar(1)
        } else {
            setAvatar(avatar + 1)
        }
    }

    const handleSubmit = async () => {

        if (username && roomId) {
            try {
                const response = await fetch('/api/register-in-room', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', },
                    body: JSON.stringify({ roomId, playerName: username }),
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
                    <div className="flex flex-col gap-4">
                        <div className="relative h-[16rem] w-[16rem] rounded-xl border-2 border-white overflow-hidden">
                            <Image src={`/avatars/${avatar}.png`} alt="" fill />
                        </div>
                        <div className="flex gap-4">
                            <Button className="px-4 py-2 text-3xl grow" onClick={handlePreviousAvatar}><IoIosArrowBack /></Button>
                            <Button className="px-4 py-2 text-3xl grow" onClick={handleNextAvatar}><IoIosArrowForward /></Button>
                        </div>
                    </div>
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