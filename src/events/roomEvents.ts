import { Socket } from 'socket.io';
import { User } from '../types/common';

const users: { [socketId: string]: User } = {};

export const handleRoomEvents = (socket: Socket) => {
    
    socket.on('setUsername', ({ username, roomId }: { username: string, roomId: string }) => {
        users[socket.id] = { id: socket.id, name: username, room: roomId, isConnected: true };
        socket.join(roomId);
        
        socket.emit('allowCheckin', true);
        socket.to(roomId).emit('usersInRoom', getUsersInRoom(roomId));
    });

    socket.on('createRoom', ({ roomName, playerName }) => {
        socket.join(roomName);
        console.log(`${playerName} criou a sala ${roomName}`);
    });

    socket.on('joinRoom', ({ roomName, playerName }: { roomName: string; playerName: string }) => {
        console.log(`${playerName} está entrando na sala: ${roomName}`);

        users[socket.id] = { id: socket.id, name: playerName, room: roomName, isConnected: true };
        socket.join(roomName);

        socket.to(roomName).emit('usersInRoom', getUsersInRoom(roomName));
    });

    socket.on('getUsersInRoom', ({roomName, user}: {roomName: string, user: string}) => {
        console.log(`${user} pediu usuarios da sala: ${roomName}`);
        const usersInRoom = getUsersInRoom(roomName);
        
        console.log(`SALA: ${roomName}`)
        for(user in usersInRoom){
            console.log(`${user}`);
        }

        socket.to(roomName).emit('usersInRoom', usersInRoom);
    })

    function getUsersInRoom(room: string) {
        return Object.values(users).filter(user => user.room === room);
    }
};