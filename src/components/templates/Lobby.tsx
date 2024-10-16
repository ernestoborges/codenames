'use client'
import { useState } from "react";
import Button from "../atoms/Button";
import { useRouter } from "next/navigation";
import { useTokenContext } from "../../context/token";

export default function Lobby() {

    const router = useRouter();
    const { setToken } = useTokenContext();
    const [username, setUsername] = useState<string>('');
    const [roomName, setRoomName] = useState<string>('');

    const handleCreateRoom = async () => {
        try {
            const response = await fetch('/api/create-room', {

                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({ roomName, playerName: username }),
            });
            const data = await response.json();
            if (response.ok) {
                setToken(data.token);
                router.push(`/game/codenames/${data.roomId}`);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <label>
                <p>Nome do jogador</p>
                <input value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <label>
                <p>Nome da sala</p>
                <input value={roomName} onChange={(e) => setRoomName(e.target.value)} />
            </label>
            <Button onClick={() => handleCreateRoom()}> Criar Sala</Button>
        </div >
    )
}