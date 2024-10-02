import express, { Request, Response } from 'express';
import { createServer } from 'http';
import next from 'next';
import { Server, Socket } from 'socket.io';
import { handleChatEvents } from './socket-events/chatEvents';
import { handleConnection } from './socket-events/connection';
import { handleRoomEvents } from './socket-events/roomEvents';
import { handleGameEvents } from './socket-events/gameEvents';
import { initializeSocketServer } from './socket';

const hostname = "localhost"
const port = 3000

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);
  // const io = new Server(httpServer);
  const io = initializeSocketServer(httpServer);

  server.all('*', (req: Request, res: Response) => {
    return handle(req, res);
  });

  io.on('connection', (socket: Socket) => {
    console.log('Novo cliente conectado', socket.id);
    handleConnection(socket);
    handleRoomEvents(socket, io);
    handleChatEvents(socket, io);
    handleGameEvents(socket);
  });

  const PORT = process.env.PORT || port;
  httpServer.listen(PORT, (err?: Error) => {
    if (err) throw err;
    console.log(`> Servidor rodando na porta ${PORT}`);
  });
});