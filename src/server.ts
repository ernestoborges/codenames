import express, { Request, Response } from 'express';
import { createServer } from 'http';
import next from 'next';
import { Server, Socket } from 'socket.io';
import { handleChatEvents } from './events/chatEvents';
import { handleConnection } from './events/connection';
import { handleRoomEvents } from './events/roomEvents';
import { db } from './database/firebase';

const hostname = "localhost"
const port = 3000

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();



async function testConnection() {
  try {
    const roomsSnapshot = await db.collection('rooms').get();
    const roomsList = roomsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log('Rooms:', roomsList);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

testConnection();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);
  const io = new Server(httpServer);

  // Middleware para lidar com requisições do Next.js
  server.all('*', (req: Request, res: Response) => {
    return handle(req, res);
  });

  // Configuração do Socket.io
  io.on('connection', (socket: Socket) => {

    console.log('Novo cliente conectado', socket.id);

    handleConnection(socket);
    handleRoomEvents(socket);
    handleChatEvents(socket);
  });

  const PORT = process.env.PORT || port;
  httpServer.listen(PORT, (err?: Error) => {
    if (err) throw err;
    console.log(`> Servidor rodando na porta ${PORT}`);
  });
});