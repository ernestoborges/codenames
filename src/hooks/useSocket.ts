import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

const useSocket = () => {

    // const [socket, setSocket] = useState<Socket | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const [connected, setConnected] = useState<boolean>(false);
    const [token, setToken] = useState<string>('');

    useEffect(() => {
        if (!socket) {
            socket = io();
        }

        const storedToken = localStorage.getItem('token');
        setToken(storedToken);

        socket.on('connect', () => {
            setConnected(true);
        });

        socket.on('disconnect', () => {
            setConnected(false);
        })

        socket.on('token', (token) => {
            updateToken(token);
        })

        return () => {
            // if (socket) {
            //     socket.disconnect();
            //     socket = null;
            // }
        };
    }, [socket]);

    const updateToken = (newToken: string) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const removeToken = () => {
        localStorage.removeItem('token');
        setToken(null);
        if (socket) {
            socket.disconnect();
        }
    };

    return { socket, connected, token, updateToken, removeToken };
};

export default useSocket;
