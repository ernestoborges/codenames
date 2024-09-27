import { Server } from 'socket.io';
import { Player } from './Player';
import { Game } from './Game';


export class GameRoom {
    private io: Server;
    public players: Player[] = [];
    public gameState: Game;
    public status: 'waiting' | 'playing';
    public roomLog: {
        type: 'action' | 'player' | 'error' | 'system';
        details: {
            player?: {
                data: Player,
                event: 'connected' | 'disconnected' | 'changeTeamRole' | 'enteredRoom'
            },
            action?: {
                player: Player,
                clue?: { word: string, number: number },
                flip?: { word: string, color: number },
                endTurn?: boolean
            },
            system?: {
                type: 'gameStart' | 'gameOver' | 'roomCreated' | 'gameReset' | 'teamsReset' | 'endTurn'
            }
        }
        message: string;
        timestamp: Date
    }[] = [];
    public chat: {
        senderId: string,
        sender: string,
        message: string,
        timestamp: Date
    }[] = [];

    constructor(io: Server, public id: string, public name: string) {
        this.io = io;
        this.status = 'waiting';
        this.gameState = new Game(this.log.bind(this));
    }

    log(type: 'action' | 'player' | 'error' | 'system', message: string, details) {
        this.roomLog.push({
            type,
            details,
            message,
            timestamp: new Date()
        })
        this.emitLog()
    }

    emitLog(){
        this.io.to(this.id).emit('roomLog', this.roomLog)
    }

    addPlayer(player: Player) {
        this.players.push(player);
        this.log('player', `${player.username} entrou na sala.`, { player, event: 'enteredRoom' })
        this.emitGameState(player.socket);
        this.emitRoomState(player.socket);
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
        if (!player) return
        if (this.status === 'playing' && player.role !== 'spectator') return

        player.role = role;
        player.team = team;

        this.log('player', `${player.username} mudou para ${player.role} do time ${player.team}.`, { player, event: 'changeTeamRole' })
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
            this.log('player', `${player.username} está online.`, { player, event: 'connected' })
            console.log(`${player.username} está online`);
        }
    }

    disconnectPlayer(id: string) {
        const player = this.players.find(p => p.id === id);
        if (player) {
            player.connected = false;
            this.emitPlayers();
            this.log('player', `${player.username} desconectado.`, { player, event: 'disconnected' })
            console.log(`${player.username} está offline`);
        }
    }

    emitPlayers() {
        this.players.forEach(me => {
            const response = this.players.map(p => ({
                username: p.username,
                role: p.role,
                team: p.team,
                admin: p.admin,
                avatar: p.avatar,
                me: me.id === p.id
            }))

            this.io.to(me.socket).emit('roomPlayers', response)
        })
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

    emitRoomState(playerSocket?: string) {
        const roomStateToSend = {
            roomId: this.id,
            name: this.name,
            status: this.status
        }
        if (playerSocket) {
            this.io.to(playerSocket).emit('roomState', roomStateToSend)
        } else {
            this.io.to(this.id).emit('roomState', roomStateToSend)
        }
    }

    startGame() {
        console.log("trying to start game")
        let minimumPlayers = {
            o1: false,
            s1: false,
            o2: false,
            s2: false
        }

        this.players.forEach(p => {
            if (p.team === 1) {
                if (p.role === 'operative' && !minimumPlayers.o1) minimumPlayers.o1 = true;
                if (p.role === 'spymaster' && !minimumPlayers.s1) minimumPlayers.s1 = true;
            } else if (p.team === 2) {
                if (p.role === 'operative' && !minimumPlayers.o2) minimumPlayers.o2 = true;
                if (p.role === 'spymaster' && !minimumPlayers.s2) minimumPlayers.s2 = true;
            }
        })
        console.log(minimumPlayers.o1)
        console.log(minimumPlayers.s1)
        console.log(minimumPlayers.o2)
        console.log(minimumPlayers.s2)

        if (
            true
            // minimumPlayers.o1 &&
            // minimumPlayers.s1 &&
            // minimumPlayers.o2 &&
            // minimumPlayers.s2
        ) {
            console.log('game started');
            this.gameState.startGame();
            this.status = 'playing';
            this.emitGameState();
            this.emitRoomState();
        }
    }

    resetTeams() {
        this.players.forEach(p => {
            p.role = 'spectator'
            p.team = 0
        })
        this.log('system', 'Os times foram redefinidos', {type: 'teamsReset'})
        this.emitPlayers();
    }

    restartGame() {
        this.status = 'waiting';
        this.log('system', 'Partida reiniciada', {type: 'gameReset'})
        this.emitRoomState();
    }
}

