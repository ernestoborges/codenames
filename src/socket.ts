import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

let io: Server | null = null;

export function initializeSocketServer(httpServer: HttpServer): Server {
    io = new Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    return io;
}

export function getSocketServerInstance(): Server {
    if (!io) {
        throw new Error('Socket.io não foi inicializado ainda!');
    }
    return io;
}