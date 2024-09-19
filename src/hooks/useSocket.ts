import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

const useSocket = () => {

    const [connected, setConnected] = useState<boolean>(false);
    const [token, setToken] = useState<string>('');

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);

        socket = io();

        socket.on('connect', () => {
            setConnected(true);
        });

        socket.on('token', (token) => {
            updateToken(token);
        })

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    const updateToken = (newToken: string) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const removeToken = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return { socket, connected, token, updateToken, removeToken };
};

export default useSocket;
