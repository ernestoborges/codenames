'use client'
import { useEffect, useState } from "react";
import { TextInput } from "../atoms/TextInput";
import Button from "../atoms/Button";
import useSocket from "../../hooks/useSocket";
import { useRouter } from "next/navigation";

export default function Lobby() {

    const { socket, connected, token} = useSocket();
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