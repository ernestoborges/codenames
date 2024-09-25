import { Server } from 'socket.io';
import { Player } from './Player';
import { Game } from './Game';


export class GameRoom {
    private io: Server;

    public players: Player[] = [];
    public gameState: Game;
    public status: string;
    public chat: {
        senderId: string,
        sender: string,
        message: string,
        timestamp: Date
    }[] = [];

    constructor(io: Server, public id: string, public name: string) {
        this.io = io;
        this.status = 'waiting';
        this.gameState = new Game();
    }

    addPlayer(player: Player) {
        this.players.push(player);
        this.emitGameState(player.socket);
        this.emitPlayers();
        console.log(`${player.username} entrou na sala ${this.name}`);
    }

    addChatMessage(player: Player, message: string) {
        const timestamp = new Date();
        this.chat.push({ senderId: player.id, sender: player.username, message, timestamp });
        this.emitChat()
    }

    emitChat(socket?: string) {

        if (socket) {
            const player = this.players.find(p => p.socket === socket)

            if (!player) {
                this.io.to(socket).emit('error', 'Erro ao atualizar chat');
                return
            }

            const chatToSend = this.chat.map(m => ({
                sender: m.sender,
                message: m.message,
                timestamp: m.timestamp,
                me: m.senderId === player.id
            }))

            this.io.to(player.socket).emit('chatUpdate', chatToSend);
        } else {
            this.players.forEach(p => {
                const chatToSend = this.chat.map(m => ({
                    sender: m.sender,
                    message: m.message,
                    timestamp: m.timestamp,
                    me: m.senderId === p.id
                }))

                this.io.to(p.socket).emit('chatUpdate', chatToSend);
            })
        }
    }

    getPlayer(id: string) {
        return this.players.find(p => p.id === id);
    }

    updatePlayerTeamAndRole(id: string, team: number, role: string) {
        const player = this.players.find(p => p.id === id);
        if (player) {
            player.role = role;
            player.team = team;
        }

        this.emitPlayers();
        this.emitGameState(player.socket)
        console.log(`${player.username} atualizado: role[${player.role}] e team[${player.team}]`);
    }

    updatePlayerSocket(id: string, socket: string) {
        const player = this.players.find(p => p.id === id);
        if (player) player.socket = socket;
        console.log(`${player.username} socket atualizado para: ${player.socket}`);
    }

    connectPlayer(id: string) {
        const player = this.players.find(p => p.id === id);
        if (player) {
            player.connected = true;
            this.emitPlayers();
            console.log(`${player.username} está online`);
        }
    }

    disconnectPlayer(id: string) {
        const player = this.players.find(p => p.id === id);
        if (player) {
            player.connected = false;
            this.emitPlayers();
            console.log(`${player.username} está offline`);
        }
    }

    emitPlayers() {
        const response = this.players.map(p => ({
            username: p.username,
            role: p.role,
            team: p.team,
            admin: p.admin,
            avatar: p.avatar
        }))

        this.io.to(this.id).emit('roomPlayers', response)
    }

    emitGameState(playerSocket?: string) {
        this.players.forEach(p => {
            const gameStateToSend = {
                ...this.gameState,
                board: p.role === 'spymaster' ? this.gameState.board : this.gameState.getOperativeCards(),
                spymasterTurn: p.role === 'spymaster' && this.gameState.turn === p.team && this.gameState.phase === 1,
                operativeTurn: p.role === 'operative' && this.gameState.turn === p.team && this.gameState.phase === 2
            };

            if (!playerSocket || playerSocket === p.socket)
                this.io.to(p.socket).emit('gameState', gameStateToSend)


            // if (playerSocket === p.socket)
            //     this.io.to(p.socket).emit('gameState', gameStateToSend)

        })
    }

    startGame() {
        this.gameState.startGame();
        this.emitGameState()
    }

    restartGame() {
        this.startGame()
    }
}

