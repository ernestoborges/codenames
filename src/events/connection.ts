import { Socket } from 'socket.io';

export const handleConnection = (socket: Socket) => {

    socket.on('disconnect', () => {

        console.log('Cliente desconectado', socket.id);
    });
};