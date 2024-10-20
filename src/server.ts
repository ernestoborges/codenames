import express, { Request, Response } from 'express';
import { createServer } from 'http';
import next from 'next';
import { Server, Socket } from 'socket.io';
import { handleChatEvents } from './socket-events/chatEvents';
import { handleConnection } from './socket-events/connection';
import { handleRoomEvents } from './socket-events/roomEvents';
import { handleGameEvents } from './socket-events/gameEvents';
import { verifyToken } from './utils/token';
import roomManager from './game/rooms';

const hostname = "localhost"
const port = 3000

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);
  let io
  if (!global.io) {
    io = new Server(httpServer, {
      cors: {
        origin: '*',
      },
    });
    global.io = io;
  } else {
    io = global.io;
  }

  io.use((socket, next) => {

    if (!socket.handshake.auth) {
      console.log('auth nao enviado')
      return next(new Error('Não autorizado'))
    }

    let { token } = socket.handshake.auth

    let decodedToken = verifyToken(token)
    if (!decodedToken) {
      console.log('token invalido')
      return next(new Error('Não autorizado'))
    }

    let { uuid, roomId } = decodedToken
    let gameRoom = roomManager.getRoom(roomId)

    if (!gameRoom){
      console.log('sala não encontrada')
      return next(new Error('Não autorizado'))
    }

    let player = gameRoom.getPlayer(uuid)
    if (!player) {
      console.log('jogador nao encontrado')
      return next(new Error('Não autorizado'))
    }
    player.socket = socket.id

    socket.data.user = decodedToken
    console.log('passou no middleware')
    next()
  })

  server.all('*', (req: Request, res: Response) => {
    return handle(req, res);
  });

  io.on('connection', (socket: Socket) => {
    console.log('Novo socket conectado: ', socket.id);

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