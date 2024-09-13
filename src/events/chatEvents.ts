import { Socket } from 'socket.io';

export const handleChatEvents = (socket: Socket) => {
    socket.on('sendMessage', ({ roomName, user, text }) => {
        const message = { user: socket.data.name, text };
        console.log(`Mensagem de ${user} na sala ${roomName}: ${text}`);

        socket.to(roomName).emit('chatMessage', message);
    });
};