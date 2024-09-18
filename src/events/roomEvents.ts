import { Socket, Server } from 'socket.io';
import { User } from '../types/common';
import { admin, db } from '../database/firebase';
import { generateToken, verifyToken } from '../utils/token';
import { v4 as uuidv4 } from 'uuid';

export const handleRoomEvents = (socket: Socket, io: Server) => {

    socket.on('createRoom', async ({ roomName, playerName }) => {

        const roomRef = db.collection('rooms');

        const roomQuery = await roomRef.where('name', '==', roomName).get();

        if (!roomQuery.empty) {
            socket.emit('error', 'Sala com esse nome já existe');
            return;
        } else {
            const uniqueCode = uuidv4();
            const newRoom = await roomRef.add({
                name: roomName,
                status: 'waiting',
                players: [{
                    id: uniqueCode,
                    username: playerName,
                    role: 'operative',
                    team: 0
                }],
                gameState: {
                    turn: 1,
                    clue: {
                        word: '',
                        number: 0
                    },
                    board: []
                },
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });

            const roomId = newRoom.id
            const newToken = generateToken({ roomId, username: playerName, uuid: uniqueCode });
            socket.join(roomId); // O socket entra na sala criada
            socket.emit('token', newToken);
            socket.emit('allowCheckin', true);

            // socket.emit('roomState', newRoom);
            io.to(roomId).emit('roomState', newRoom);
            console.log(`${playerName} criou a sala ${roomName}`);
        }
    });

    socket.on('joinRoom', async ({ roomId, playerName, token }: { roomId: string; playerName: string, token: string }) => {

        if (!roomId) {
            socket.emit('error', 'ID da sala não fornecido');
            console.log('ID da sala não fornecido');
            return;
        }

        const roomRef = db.collection('rooms').doc(roomId);

        let roomDoc;
        try {
            roomDoc = await roomRef.get();
        } catch (error) {
            console.error('Erro ao acessar o documento da sala:', error);
            socket.emit('error', 'Erro ao acessar o documento da sala');
            return;
        }

        if (!roomDoc.exists) {
            socket.emit('error', 'Sala não encontrada');
            console.log(`Sala não encontrada: ${roomId}`);
            return;
        }

        const roomData = roomDoc.data();

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
            const existingPlayer = roomData.players.find((player: any) => player.id === uuid);

            if (existingPlayer) {
                console.log(`Cliente reconectado: ${uuid}`);
                socket.join(roomId);
                socket.emit('allowCheckin', true);
                socket.emit('token', token)

                // socket.emit('roomState', roomData);
                io.to(roomId).emit('roomState', roomData);
                console.log(`${existingPlayer.username} entrou na sala ${roomId}`);
                return;
            }
        }

        if (!playerName) {
            console.log('Nenhum token válido ou nome de jogador fornecido');
            socket.emit('error', 'Nome do jogador não fornecido. Por favor, envie um nome.');
            socket.emit('allowCheckin', false);
            return;
        }

        const nameExists = roomData.players.some((player: any) => player.username === playerName);
        if (nameExists) {
            console.log(`Nome de jogador já existe na sala: ${playerName}`);
            socket.emit('error', 'Nome de usuário já existe na sala');
            socket.emit('allowCheckin', false);
            return;
        }

        const newid = uuidv4();
        const newToken = generateToken({ roomId, username: playerName, uuid: newid });

        try {
            await roomRef.update({
                players: admin.firestore.FieldValue.arrayUnion({
                    id: newid,
                    username: playerName,
                    role: 'operative',
                    team: 0
                }),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error('Erro ao atualizar a sala com novo jogador:', error);
            socket.emit('error', 'Erro ao adicionar novo jogador na sala');
            return;
        }

        const updatedRoomDoc = await roomRef.get();
        const updatedRoomData = updatedRoomDoc.data();

        // Conectar jogador à sala e emitir o estado atualizado
        socket.join(roomId);
        socket.emit('token', newToken);
        socket.emit('allowCheckin', true);

        // socket.emit('roomState', updatedRoomData);
        io.to(roomId).emit('roomState', updatedRoomData);
        console.log(`${playerName} entrou na sala ${roomId}`);



        // if (!decodedToken && !playerName) {

        //     if (!playerName) {
        //         console.log(`Token: ${token} invalido e sem nome de jogador: ${playerName}`);
        //         socket.emit('allowCheckin', false);
        //         return;
        //     }

        //     // const roomData = roomDoc.data();
        //     const nameExists = roomData.players.some((player: any) => player.username === playerName);
        //     if (nameExists) {
        //         console.log(`Nome de usuário já existe na sala: ${playerName}`);
        //         socket.emit('error', 'Nome de usuário já existe na sala');
        //         socket.emit('allowCheckin', false);
        //         return;
        //     }

        //     const newid = uuidv4();
        //     const newToken = generateToken({ roomId, username: playerName, uuid: newid });

        //     await roomRef.update({
        //         players: admin.firestore.FieldValue.arrayUnion({
        //             id: newid,
        //             username: playerName,
        //             role: 'spectator',
        //             team: 0
        //         }),
        //         updatedAt: admin.firestore.FieldValue.serverTimestamp()
        //     });

        //     const updatedRoomDoc = await roomRef.get();
        //     const updatedRoomData = updatedRoomDoc.data();

        //     socket.join(roomId);
        //     socket.emit('token', newToken);
        //     socket.emit('allowCheckin', true);
        //     socket.to(roomId).emit('roomState', updatedRoomData);
        //     console.log(`${playerName} entrou na sala ${roomId}`);
        // }

        // const { uuid } = decodedToken;
        // console.log(`Buscando dados da sala para cliente: ${uuid}`);
        // // const roomData = roomDoc.data();
        // const existingPlayer = roomData.players.find((player: any) => player.id === uuid);
        // if (existingPlayer) {
        //     console.log(`Cliente reconectado: ${uuid}`);
        //     socket.join(roomId);
        //     socket.emit('allowCheckin', true);
        //     socket.to(roomId).emit('roomState', roomData);
        //     console.log(`${existingPlayer.username} entrou na sala ${roomId}`);
        //     return;
        // } else {
        //     console.log(`Cadastrando jogador na sala: ${uuid}`);

        //     const nameExists = roomData.players.some((player: any) => player.username === playerName);
        //     if (nameExists) {
        //         socket.emit('error', 'Nome de usuário já existe na sala');
        //         socket.emit('allowCheckin', false);
        //         return;
        //     }

        //     const newid = uuidv4();
        //     const newToken = generateToken({ roomId, username: playerName, uuid: newid });

        //     await roomRef.update({
        //         players: admin.firestore.FieldValue.arrayUnion({
        //             id: newid,
        //             username: playerName,
        //             role: 'spectator',
        //             team: 0
        //         }),
        //         updatedAt: admin.firestore.FieldValue.serverTimestamp()
        //     });

        //     const updatedRoomDoc = await roomRef.get();
        //     const updatedRoomData = updatedRoomDoc.data();

        //     socket.join(roomId);
        //     socket.emit('token', newToken);
        //     socket.emit('allowCheckin', true);
        //     socket.to(roomId).emit('roomState', updatedRoomData);
        //     console.log(`${playerName} entrou na sala ${roomId}`);
        // }
    });

    socket.on('changeRole', async ({ token, role }) => {

        if (role !== 'spymaster' && role !== 'operative') {
            socket.emit('error', `Role inválida: ${role}`);
            return;
        }

        const decodedToken = verifyToken(token);
        if (!decodedToken) {
            socket.emit('error', 'Token inválido');
            return;
        }

        const { roomId, uuid } = decodedToken;

        const roomRef = db.collection('rooms').doc(roomId);
        const roomDoc = await roomRef.get();

        if (!roomDoc.exists) {
            socket.emit('error', 'Sala não encontrada');
            return;
        }

        const roomData = roomDoc.data();
        const playerIndex = roomData.players.findIndex((player) => player.id === uuid);

        if (playerIndex === -1) {
            socket.emit('error', 'Jogador não encontrado');
            return;
        }

        // Atualiza a role do jogador
        roomData.players[playerIndex].role = role;

        // Atualiza o Firestore com a nova role
        await roomRef.update({
            players: roomData.players,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Envia o novo estado da sala para todos os jogadores
        io.to(roomId).emit('roomState', roomData);
        console.log(`Jogador ${uuid} alterou sua role para ${role}`);
    })

    socket.on('changeTeam', async ({ token, team }) => {

        if (team !== 0 && team !== 1 && team !== 2) {
            socket.emit('error', `Time inválido: ${team}`);
            return;
        }

        const decodedToken = verifyToken(token);
        if (!decodedToken) {
            socket.emit('error', 'Token inválido');
            return;
        }

        const { roomId, uuid } = decodedToken;

        const roomRef = db.collection('rooms').doc(roomId);
        const roomDoc = await roomRef.get();

        if (!roomDoc.exists) {
            socket.emit('error', 'Sala não encontrada');
            return;
        }

        const roomData = roomDoc.data();
        const playerIndex = roomData.players.findIndex((player) => player.id === uuid);

        if (playerIndex === -1) {
            socket.emit('error', 'Jogador não encontrado');
            return;
        }

        // Atualiza o time do jogador
        roomData.players[playerIndex].team = team;

        // Atualiza o Firestore com o novo time
        await roomRef.update({
            players: roomData.players,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Envia o novo estado da sala para todos os jogadores
        io.to(roomId).emit('roomState', roomData);
        console.log(`Jogador ${uuid} alterou seu time para ${team}`);
    });

    socket.on('updateTeam', async ({ token, team, role }) => {

        if (team && team !== '0' && team !== '1' && team !== '2') {
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

        const roomRef = db.collection('rooms').doc(roomId);
        const roomDoc = await roomRef.get();

        if (!roomDoc.exists) {
            socket.emit('error', 'Sala não encontrada');
            return;
        }

        const roomData = roomDoc.data();
        const playerIndex = roomData.players.findIndex((player) => player.id === uuid);

        if (playerIndex === -1) {
            socket.emit('error', 'Jogador não encontrado');
            return;
        }

        // Atualiza o time do jogador
        if (team)
            roomData.players[playerIndex].team = team;

        if (role)
            roomData.players[playerIndex].role = role;

        // Atualiza o Firestore com o novo time
        await roomRef.update({
            players: roomData.players,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Envia o novo estado da sala para todos os jogadores
        io.to(roomId).emit('roomState', roomData);
        console.log(`Jogador ${uuid} alterou seu time para ${team} e role para ${role}`);
    });
};