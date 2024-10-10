import { Server, Socket } from 'socket.io';
import roomManager from '../game/rooms';

export const handleChatEvents = (socket: Socket, io: Server) => {
    socket.on('sendMessage', async ({ message }: { message: string }) => {

        if (!message) {
            socket.emit('error', 'Mensagem não enviada');
            return;
        }

        let { roomId, uuid } = socket.data.user

        const room = roomManager.getRoom(roomId)
        if (!room) {
            socket.emit('error', 'Sala não encontrada');
            return;
        }

        const player = room.getPlayer(uuid)
        if (player) {
            room.addChatMessage(player, message);
            io.to(roomId).emit('chatUpdate', room.getChatMessages());
        }
    });
};