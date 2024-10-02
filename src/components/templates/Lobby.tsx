'use client'
import { useEffect, useState } from "react";
import { TextInput } from "../atoms/TextInput";
import Button from "../atoms/Button";
import useSocket from "../../hooks/useSocket";
import { useRouter } from "next/navigation";

export default function Lobby() {

    const { socket, connected, token, updateToken } = useSocket();
    const router = useRouter();
    const [username, setUsername] = useState<string>('');
    const [roomName, setRoomName] = useState<string>('');

    useEffect(() => {
        if (socket && connected) {
            socket.on('roomCreated', (roomId) => {
                router.push(`/game/codenames/${roomId}`);
            })
        }
    }, [socket, connected])

    const handleCreateRoom = async () => {
        try {
            const response = await fetch('/api/create-room', {

                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({ roomName, playerName: username }),
            });
            const data = await response.json();
            if (response.ok) {
                updateToken(data.token);
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
            <Button onClick={() => socket.emit('createRoom', { token, playerName: username, roomName })}> Criar Sala</Button>
        </div >
    )
}