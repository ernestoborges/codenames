import { Socket } from 'socket.io';
import { verifyToken } from '../utils/token';
import roomManager from '../game/rooms';

export const handleGameEvents = (socket: Socket) => {

    socket.on('gameFlipCard', async ({ token, cardPosition }) => {
        try {
            const decodedToken = verifyToken(token);
            if (!decodedToken) throw new Error('Token inválido');
            if (cardPosition === undefined) throw new Error('Posição da carta não enviada');
            if (isNaN(cardPosition)) throw new Error('Carta não existe');

            const { uuid, roomId } = decodedToken;

            const game = roomManager.getRoom(roomId);
            if (!game) throw new Error('Sala não encontrada');
            if (game.gameState.winner !== 0) throw new Error('Partida encerrada');
            if (game.gameState.phase !== 2) throw new Error('Não é sua vez');


            const player = game.getPlayer(uuid);
            if (!player) throw new Error('Jogador não encontrado');
            if (player.role !== 'operative') throw new Error('Você não é operative');
            if (player.team !== game.gameState.turn) throw new Error('Não é seu turno');

            const card = game.gameState.getCard(cardPosition);
            if (!card) throw new Error('Carta não encontrada')
            if (!card.hidden) throw new Error('Carta já está revelada');

            game.gameState.flipCard(player, cardPosition)
            game.emitGameState();
        }
        catch (error) {
            socket.emit('error', error.message);
        }
    });


    socket.on('gameClue', ({ token, word, number }) => {
        try {
            const decodedToken = verifyToken(token);
            if (!decodedToken) throw new Error('Token inválido');
            if (number === undefined) throw new Error('Numero de dicas inválido');
            if (!word) throw new Error('Dica não enviada');

            const { uuid, roomId } = decodedToken;

            const game = roomManager.getRoom(roomId);
            if (!game) throw new Error('Sala não encontrada');
            if (game.gameState.winner !== 0) throw new Error('Partida encerrada');
            if (game.gameState.phase !== 1) throw new Error('Não é sua vez');


            const player = game.getPlayer(uuid);
            if (!player) throw new Error('Jogador não encontrado');
            if (player.role !== 'spymaster') throw new Error('Você não é spymaster');
            if (player.team !== game.gameState.turn) throw new Error('Não é seu turno');

            game.gameState.clue.word = word
            game.gameState.clue.number = number < 0 ? -1 : number
            game.gameState.clue.remaining = number + 1
            game.gameState.phase = 2
            game.log(
                'action',
                `${player.username} deu a dica [${game.gameState.clue.word}][${game.gameState.clue.number}]`,
                { action: { player, clue: { word: game.gameState.clue.word, number: game.gameState.clue.number } } }
            )
            game.emitGameState();
        }
        catch (error) {
            socket.emit('error', error.message);
        }
    });

    socket.on('gameTip', ({ token, cardIndex }) => {
        try {
            const decodedToken = verifyToken(token);
            if (!decodedToken) throw new Error('Token inválido');

            const { uuid, roomId } = decodedToken;

            const game = roomManager.getRoom(roomId);
            if (!game) throw new Error('Sala não encontrada');
            if (game.gameState.winner !== 0) throw new Error('Partida encerrada');
            if (game.gameState.phase !== 2) throw new Error('Não é sua vez');


            const player = game.getPlayer(uuid);
            if (!player) throw new Error('Jogador não encontrado');
            if (player.role !== 'operative') throw new Error('Você não é operative');
            if (player.team !== game.gameState.turn) throw new Error('Não é seu turno');

            const card = game.gameState.board.find(c => c.position === cardIndex)
            if (!card) throw new Error('Carta não encontrada');

            const alreadyTipped = card.tips.find(name => name === player.username)
            if (alreadyTipped) {
                card.tips = card.tips.filter(n => n !== player.username)
            } else {
                card.tips.push(player.username)
            }

            game.emitGameState();
        }
        catch (error) {
            socket.emit('error', error.message);
        }
    });

    socket.on('gameEndTurn', ({ token }) => {
        try {
            const decodedToken = verifyToken(token);
            if (!decodedToken) throw new Error('Token inválido');

            const { uuid, roomId } = decodedToken;

            const game = roomManager.getRoom(roomId);
            if (!game) throw new Error('Sala não encontrada');
            if (game.gameState.winner !== 0) throw new Error('Partida encerrada');
            if (game.gameState.phase !== 2) throw new Error('Não é sua vez');


            const player = game.getPlayer(uuid);
            if (!player) throw new Error('Jogador não encontrado');
            if (player.role !== 'operative') throw new Error('Você não é operative');
            if (player.team !== game.gameState.turn) throw new Error('Não é seu turno');

            game.gameState.endTurn();
            game.log(
                'action',
                `${player.username} encerrou o turno.`,
                { action: { player, endTurn: true } }
            )
            game.emitGameState();
        }
        catch (error) {
            socket.emit('error', error.message);
        }
    });
};