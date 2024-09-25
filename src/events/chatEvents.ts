import { Server, Socket } from 'socket.io';
import { verifyToken } from '../utils/token';
import roomManager from '../game/rooms';

export const handleChatEvents = (socket: Socket, io: Server) => {
    socket.on('sendMessage', async ({ message, token }: { message: string; token: string }) => {

        if (!message) {
            socket.emit('error', 'Mensagem não enviada');
            return;
        }

        const decodedToken = verifyToken(token);
        if (!decodedToken) {
            socket.emit('error', 'Token inválido');
            return;
        }

        const { uuid, roomId } = decodedToken;
        
        const game = roomManager.getRoom(roomId)
        if (!game) {
            socket.emit('error', 'Sala não encontrada');
            return;
        }

        const player = game.getPlayer(uuid)
        if (!player) {
            socket.emit('error', 'Jogador não encontrado');
            return;
        }

        game.addChatMessage(player, message);
    });
};