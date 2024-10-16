import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useTokenContext } from './token';

interface ISocketContext {
    socket: Socket | null;
    connected: boolean;
}

const SocketContext = createContext<ISocketContext | undefined>(undefined);

export const useSocketContext = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocketContext must be used within a SocketProvider');
    }
    return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { token } = useTokenContext();
    
    const [socket, setSocket] = useState<Socket | null>(null);
    const [connected, setConnected] = useState<boolean>(false);

    useEffect(() => {
        if (token) {
            const newSocket = io({
              auth: { token }
            });
      
            newSocket.on('connect', () => {
              setConnected(true);
              console.log('Conectado ao servidor Socket.io');
            });
      
            newSocket.on('disconnect', () => {
              setConnected(false);
              console.log('Desconectado do servidor Socket.io');
            });
      
            setSocket(newSocket);
      
            return () => {
              newSocket.disconnect();
            };
          }
    }, [token]);

    return (
        <SocketContext.Provider value={{ socket, connected }}>
            {children}
        </SocketContext.Provider>
    );
};
