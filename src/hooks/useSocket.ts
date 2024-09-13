import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type SocketType = Socket | null;

let socket: Socket | null = null;

const useSocket = (roomName: string) => {

    // const socketRef = useRef<Socket | null>(null);
    // const [isConnected, setIsConnected] = useState<boolean>(false);

    // useEffect(() => {
    //     const savedSocketId = localStorage.getItem('socketId');

    //     if (!socketRef.current) {
    //         socketRef.current = io('http://localhost:3000', {
    //             query: { socketId: savedSocketId || undefined },
    //         });

    //         socketRef.current.on('connect', () => {
    //             console.log(socketRef.current!.id!);
    //             localStorage.setItem('socketId', socketRef.current!.id!);
    //             setIsConnected(true);
    //         });

    //         socketRef.current.on('disconnect', () => {
    //             localStorage.removeItem('socketId');
    //             setIsConnected(false);
    //         });

    //     }

    //     return () => {
    //         if (socketRef.current) {
    //             socketRef.current.disconnect();
    //             socketRef.current = null;
    //         }
    //     };
    // }, []);

    // return socketRef.current;

    const [connected, setConnected] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);

        socket = io({
            query: { token: storedToken, roomName },
        });

        socket.on('connect', () => {
            setConnected(true);
        });

        socket.on('token', (newToken: string) => {
            localStorage.setItem('token', newToken);
        });

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [roomName]);

    return { socket, connected };
};

export default useSocket;
