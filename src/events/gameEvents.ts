import { Server, Socket } from 'socket.io';
import { verifyToken } from '../utils/token';
import { admin, db } from '../database/firebase';

export const handleGameEvents = (socket: Socket, io: Server) => {

    socket.on('gameFlipCard', async ({ token, cardPosition }) => {
        const decodedToken = verifyToken(token);
        if (!decodedToken) {
            socket.emit('error', 'Token inválido');
            return;
        }

        if (!cardPosition) {
            socket.emit('error', 'Posição da carta não enviada');
            return;
        }

        const { uuid, roomId } = decodedToken;

        if (isNaN(cardPosition)) {
            socket.emit('error', 'Carta não existe');
            return;
        }

        const roomRef = db.collection('rooms').doc(roomId);
        const roomDoc = await roomRef.get();

        if (!roomDoc.exists) {
            socket.emit('error', 'Sala não encontrada');
            return;
        }

        const roomData = roomDoc.data();

        if (roomData.roomState.gameState.clue.number < 1) {
            socket.emit('error', 'Não tem mais palpites');
            return;
        }

        const player = roomData.roomState.players.find((p: any) => p.id === uuid)
        if (!player) {
            socket.emit('error', 'Jogador não encontrado');
            return;
        }

        if (player.role !== 'operative') {
            socket.emit('error', 'Você não é operative');
            return;
        }

        if (Number(player.team) !== roomData.roomState.gameState.turn) {
            socket.emit('error', 'Não é seu turno');
            return;
        }

        const cardIndex = roomData.roomState.gameState.board.findIndex((c: any) => c.position === cardPosition);

        if (cardIndex === -1) {
            socket.emit('error', 'Carta não encontrada');
            return;
        }

        if (roomData.roomState.gameState.board[cardIndex].hidden) {
            socket.emit('error', 'Carta já está revelada');
            return;
        }

        roomData.roomState.gameState.board[cardIndex].hidden = false
        console.log(`Jogador ${player.username} virou a carta ${roomData.spymasterData.boardAnswers[cardIndex].word}`);

        switch (roomData.spymasterData.boardAnswers[cardIndex].color) {
            case 0: // gray card
                break;
            case 1: // blue card
                if (player.team === 1) {
                    roomData.roomState.gameState.teamsScore.team1--
                    roomData.roomState.gameState.clue.number--
                    console.log(`Ponto do time azul`);

                    if (roomData.roomState.gameState.teamsScore.team1 <= 0) {
                        roomData.roomState.status = "gameover"
                        roomData.roomState.winner = 1
                        console.log(`time azul venceu`);
                        io.to(roomId).emit('spymasterCards', roomData.spymasterData)
                    } else if (roomData.roomState.gameState.clue.number <= 0) {
                        roomData.roomState.gameState.turn = 2
                        roomData.roomState.gameState.clue.word = ''
                        roomData.roomState.gameState.clue.number = 0
                    }
                } else {
                    roomData.roomState.gameState.teamsScore.team2--
                    roomData.roomState.gameState.turn = 2
                    roomData.roomState.gameState.clue.word = ''
                    roomData.roomState.gameState.clue.number = 0
                    console.log(`Ponto do time vermelho`);

                    if (roomData.roomState.gameState.teamsScore.team2 <= 0) {
                        roomData.roomState.status = "gameover"
                        roomData.roomState.winner = 2
                        console.log(`time vermelho venceu`);
                        io.to(roomId).emit('spymasterCards', roomData.spymasterData)
                    }
                }
                break;
            case 2: // red card
                if (player.team === 2) {
                    roomData.roomState.gameState.teamsScore.team1--
                    roomData.roomState.gameState.clue.number--
                    console.log(`Ponto do time vermelho`);

                    if (roomData.roomState.gameState.teamsScore.team1 <= 0) {
                        roomData.roomState.status = "gameover"
                        roomData.roomState.winner = 2
                        console.log(`time vermelho venceu`);
                        io.to(roomId).emit('spymasterCards', roomData.spymasterData)
                    } else if (roomData.roomState.gameState.clue.number <= 0) {
                        roomData.roomState.gameState.turn = 1
                        roomData.roomState.gameState.clue.word = ''
                        roomData.roomState.gameState.clue.number = 0
                    }
                } else {
                    roomData.roomState.gameState.teamsScore.team1--
                    roomData.roomState.gameState.turn = 1
                    roomData.roomState.gameState.clue.word = ''
                    roomData.roomState.gameState.clue.number = 0
                    console.log(`Ponto do time azul`);

                    if (roomData.roomState.gameState.teamsScore.team1 <= 0) {
                        roomData.roomState.status = "gameover"
                        roomData.roomState.winner = 1
                        console.log(`time azul venceu`);
                        io.to(roomId).emit('spymasterCards', roomData.spymasterData)
                    }
                }
                break;
            case 3: // black card
                roomData.roomState.status = "gameover"
                roomData.roomState.winner = player.team === 1 ? 2 : 1
                io.to(roomId).emit('spymasterCards', roomData.spymasterData)
                console.log(`Carta preta, fim de jogo`);
                break;
        }

        roomData.roomState.updatedAt = admin.firestore.FieldValue.serverTimestamp()
        await roomRef.update({
            'roomState': roomData.roomState
        });

        io.to(roomId).emit('roomState', roomData.roomState);
    });


    socket.on('gameClue', ({ token, word, number }) => {

    });

    socket.on('gameGuess', ({ token, cardIndex }) => {

    });

    socket.on('gameEndTurn', ({ token }) => {

    });


};