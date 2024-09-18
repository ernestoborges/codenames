import { User } from '../types/common';
import { generateToken, verifyToken } from '../utils/token';
import { Socket } from 'socket.io';


const users: { [socketId: string]: User } = {};
const userTokens: { [token: string]: User } = {};

export const handleConnection = (socket: Socket) => {

    // const { token } = socket.handshake.query;

    // if (token) {
    //     const decoded = verifyToken(token as string);

    //     if (decoded) {
    //         const { userId, roomId } = decoded;

    //         const user = userTokens[token as string];
    //         if (user) {
    //             console.log(`Cliente reconectado: ${user.name} com ID ${socket.id}`);
    //             users[socket.id] = { ...user, id: socket.id };
    //             delete users[user.id];
    //             socket.join(roomId);

    //             socket.emit('allowCheckin', true);
    //             socket.to(roomId).emit('usersInRoom', getUsersInRoom(roomId));
    //         } else {
    //             console.log('Token inválido ou usuário não encontrado.');
    //             socket.emit('allowCheckin', false);
    //         }
    //     } else {
    //         console.log('Token inválido.');
    //         socket.emit('allowCheckin', false);
    //     }
    // } else {
    //     console.log('Novo cliente conectado', socket.id);
    //     socket.emit('allowCheckin', false);
    // }

    // if (socketId && users[socketId as string]) {
    //     const user = users[socketId as string];
    //     console.log(`Cliente reconectado: ${user.name} com ID ${socket.id}`);
    //     users[socket.id] = { ...user, id: socket.id };
    //     delete users[socketId as string];
    //     socket.join(user.room);

    //     socket.emit('allowCheckin', true);
    //     socket.to(user.room).emit('usersInRoom', getUsersInRoom(user.room));
    // } else {
    //     console.log('Novo cliente conectado', socket.id);
    //     socket.emit('allowCheckin', false);
    // }

    // socket.on('setUsername', ({ username, roomId }: { username: string, roomId: string }) => {
    //     const newToken = generateToken({ socket.id, roomId });
    //     userTokens[newToken] = { id: socket.id, name: username, room: roomId, isConnected: true };
    //     users[socket.id] = { id: socket.id, name: username, room: roomId, isConnected: true };
    //     socket.join(roomId);

    //     socket.emit('allowCheckin', true);
    //     socket.emit('token', newToken);
    //     socket.to(roomId).emit('usersInRoom', getUsersInRoom(roomId));
    // });

    socket.on('disconnect', () => {
        const user = users[socket.id];
        if (user) {
            users[socket.id] = { ...users[socket.id], isConnected: false };
            socket.to(user.room).emit('usersInRoom', getUsersInRoom(user.room));
        }
        console.log('Cliente desconectado', socket.id);
    });
};

function getUsersInRoom(room: string) {
    return Object.values(users).filter(user => user.room === room);
}