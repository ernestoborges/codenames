import { Socket } from 'socket.io';
import roomManager from '../game/rooms';

export const handleConnection = (socket: Socket) => {


    socket.on('sync', () => {
        const { roomId } = socket.data.user

        const gameRoom = roomManager.getRoom(roomId)
        if (gameRoom) {
            gameRoom.emitRoomState(socket.id)
            gameRoom.emitGameState(socket.id)
            gameRoom.emitPlayers()
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado', socket.id);
    });
};