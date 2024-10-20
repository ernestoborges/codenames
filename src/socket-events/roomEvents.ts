import { Socket, Server } from 'socket.io';
import { verifyToken } from '../utils/token';
import roomManager from '../game/rooms';

export const handleRoomEvents = (socket: Socket, io: Server) => {

    socket.on('joinRoom', () => {

        const { uuid, roomId } = socket.data.user

        const game = roomManager.getRoom(roomId)
        if (!game) {
            socket.emit('error', 'Sala não encontrada');
            return;
        }

        const player = game.getPlayer(uuid);
        if (!player) {
            socket.emit('error', 'Jogador nao cadastrado');
            return;
        }

        game.updatePlayerSocket(player.id, socket.id)
        socket.join(roomId);
        game.connectPlayer(player.id);
        game.emitRoomState(player.socket);
        game.emitGameState(player.socket);
        console.log(`${player.username} entrou na sala ${roomId}`);
    });

    socket.on('leaveRoom', () => {

        const { uuid, roomId } = socket.data.user

        const game = roomManager.getRoom(roomId)
        if (!game) {
            socket.emit('error', 'Sala não encontrada');
            return;
        }

        const player = game.getPlayer(uuid);
        if (!player) {
            socket.emit('error', 'Jogador nao cadastrado');
            return;
        }

        game.removePlayer(player.id);
        socket.disconnect(true);
        console.log(`${player.username} saiu da sala ${roomId}`);
    });

    socket.on('startGame', () => {
        try {
            const { uuid, roomId } = socket.data.user;

            const game = roomManager.getRoom(roomId);
            if (!game) throw new Error('Sala não encontrada');

            const player = game.getPlayer(uuid);
            if (!player) throw new Error('Jogador não encontrado na sala');
            if (!player.admin) throw new Error('Jogador não é admin');

            game.startGame();
        }
        catch (error: any) {
            socket.emit('error', error.message);
        }
    });

    socket.on('restartGame', async () => {
        const { uuid, roomId } = socket.data.user;

        const game = roomManager.getRoom(roomId);
        if (!game) {
            socket.emit('error', 'Sala não encontrada');
            return;
        }

        const player = game.getPlayer(uuid);
        if (!player) {
            socket.emit('error', 'Jogador não encontrado na sala');
            return;
        }

        if (!player.admin) {
            socket.emit('error', 'Jogador não é admin');
            return;
        }

        game.restartGame();
    })

    socket.on('updateTeam', async ({ team, role }) => {

        if (team !== 0 && team !== 1 && team !== 2) {
            socket.emit('error', `Time inválido: ${team}`);
            return;
        }

        if (role && role !== 'spymaster' && role !== 'operative') {
            socket.emit('error', `Role inválida: ${role}`);
            return;
        }

        const { uuid, roomId } = socket.data.user

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

        game.updatePlayerTeamAndRole(player.id, team, role);
    });

    socket.on('gameResetTeams', ({ token }) => {
        try {
            const decodedToken = verifyToken(token);
            if (!decodedToken) throw new Error('Token inválido');

            const { uuid, roomId } = decodedToken;

            const game = roomManager.getRoom(roomId);

            if (!game) throw new Error('Sala não encontrada');

            const player = game.getPlayer(uuid);
            if (!player) throw new Error('Jogador não encontrado na sala');
            if (!player.admin) throw new Error('Jogador não é admin');

            game.resetTeams();
        }
        catch (error: any) {
            socket.emit('error', error.message);
        }
    });
};