import { Socket, Server } from 'socket.io';
import { generateToken, verifyToken } from '../utils/token';
import { v4 as uuidv4 } from 'uuid';
import { GameRoom } from '../game/GameRoom';
import { Player } from '../game/Player';
import roomManager from '../game/rooms';
import { randomNumberExclude } from '../utils/functions';

export const handleRoomEvents = (socket: Socket, io: Server) => {
    socket.on('createRoom', ({ playerName, roomName }: { playerName: string, roomName: string }) => {
        if (!playerName || !roomName) {
            socket.emit('error', 'Nome do jogador ou da sala não enviado');
            return;
        }

        const roomId = uuidv4();
        const newRoom = new GameRoom(io, roomId, roomName);

        const avatar = randomNumberExclude([], 1, 47);
        const player = new Player(uuidv4(), playerName, socket.id, avatar, true);

        newRoom.addPlayer(player);
        roomManager.addRoom(newRoom);

        const token = generateToken({ roomId, username: playerName, uuid: player.id });
        socket.emit('token', token);
        socket.emit('roomCreated', roomId);
        console.log(`${playerName} criou a sala ${roomName}`);
    });

    socket.on('joinRoom', ({ roomId, playerName, token }: { roomId: string; playerName: string; token: string }) => {
        const game = roomManager.getRoom(roomId);
        if (!game) {
            socket.emit('error', 'Sala não encontrada');
            return;
        }

        let decodedToken;
        if (token) {
            try {
                decodedToken = verifyToken(token);
            } catch (error) {
                console.log('Token inválido ou não decodificado');
            }
        }

        if (decodedToken) {
            const { uuid } = decodedToken;
            const player = game.getPlayer(uuid);

            if (player) {
                game.updatePlayerSocket(player.id, socket.id)
                console.log(`Cliente reconectado: ${uuid}`);
                socket.join(roomId);
                game.connectPlayer(player.id);
                socket.emit('allowCheckin', true);
                socket.emit('token', token)

                console.log(`${player.username} entrou na sala ${roomId}`);
                return;
            }
        }

        if (!playerName) {
            socket.emit('error', 'Nome de usuário não enviado');
            return;
        }

        const nameExists = game.players.some(player => player.username === playerName);
        if (nameExists) {
            socket.emit('error', 'Nome de usuário já existe na sala');
            return;
        }

        const playerAvatars = game.players.map(p => p.avatar)
        const avatar = randomNumberExclude(playerAvatars, 1, 47);
        const player = new Player(uuidv4(), playerName, socket.id, avatar);
        socket.join(roomId);
        const newToken = generateToken({ roomId, username: playerName, uuid: player.id });
        socket.emit('token', newToken)
        game.addPlayer(player);
    });

    socket.on('startGame', ({ roomId }: { roomId: string }) => {
        const game = roomManager.getRoom(roomId);
        if (game) {
            game.startGame();
            console.log(`Jogo iniciado na sala ${roomId}`);
        } else {
            socket.emit('error', 'Sala não encontrada');
        }
    });

    socket.on('restartGame', async ({ token }) => {

        const decodedToken = verifyToken(token);
        if (!decodedToken) {
            socket.emit('error', 'Token inválido');
            return;
        }

        const { uuid, roomId } = decodedToken;

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

    socket.on('updateTeam', async ({ token, team, role }) => {

        if (team !== 0 && team !== 1 && team !== 2) {
            socket.emit('error', `Time inválido: ${team}`);
            return;
        }

        if (role && role !== 'spymaster' && role !== 'operative') {
            socket.emit('error', `Role inválida: ${role}`);
            return;
        }

        const decodedToken = verifyToken(token);
        if (!decodedToken) {
            socket.emit('error', 'Token inválido');
            return;
        }

        const { roomId, uuid } = decodedToken;

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
};