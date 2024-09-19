import { Server, Socket } from 'socket.io';
import { db } from '../database/firebase';
import { verifyToken } from '../utils/token';

export const handleChatEvents = (socket: Socket, io: Server) => {
    socket.on('sendMessage', async ({ message, token }: { message: string; token: string }) => {

        const decodedToken = verifyToken(token);
        if (!decodedToken) {
            socket.emit('error', 'Token inválido');
            return;
        }

        const { uuid, roomId } = decodedToken;

        // Verificar se a sala existe
        const roomRef = db.collection('rooms').doc(roomId);
        const roomDoc = await roomRef.get();

        if (!roomDoc.exists) {
            socket.emit('error', 'Sala não encontrada');
            return;
        }

        const roomData = roomDoc.data();

        // Encontrar o jogador na sala pelo UUID
        const player = roomData.players.find((p: any) => p.id === uuid);
        if (!player) {
            socket.emit('error', 'Jogador não encontrado na sala');
            return;
        }

        // Criar um objeto de mensagem com o nome do jogador e a mensagem enviada
        const chatMessage = {
            username: player.username,
            message,
            timestamp: new Date().toISOString()
        };

        // Emitir a mensagem para todos os jogadores da sala
        io.to(roomId).emit('receiveMessage', chatMessage);
        console.log(`Mensagem de ${player.username} na sala ${roomId}: ${message}`);
    });
};