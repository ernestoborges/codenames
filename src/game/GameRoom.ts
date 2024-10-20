import { Server } from 'socket.io';
import { Player } from './Player';
import { Game } from './Game';
import { Chat } from './Chat';
import { Log } from './Log';
import roomManager from './rooms';

export class GameRoom {
    public players: Player[] = [];
    public gameState: Game;
    public status: 'waiting' | 'playing';
    public log: Log;
    private chat: Chat;

    constructor(public id: string, public name: string, public io: Server) {
        this.status = 'waiting';
        this.chat = new Chat();
        this.log = new Log(this.id, this.io);
        this.gameState = new Game(this.log);
        this.log.addSystemLog({ event: 'roomCreated' })
    }

    // log(type: 'action' | 'player' | 'error' | 'system', message: string, details) {
    //     this.roomLog.push({
    //         type,
    //         details,
    //         message,
    //         timestamp: new Date()
    //     })
    //     this.emitLog()
    // }

    // emitLog() {
    //     this.io.to(this.id).emit('roomLog', this.roomLog)
    // }

    private logPlayerEvent(player: Player, event: 'connected' | 'disconnected' | 'changeTeamRole') {
        this.log.addPlayerLog(player, event);
    }

    private logActionEvent(player: Player, clue?: { word: string, number: number }, flip?: { word: string, color: number }) {
        this.log.addActionLog({ player, clue, flip });
    }

    private logSystemEvent(event: 'gameStart' | 'gameOver' | 'roomCreated' | 'gameReset' | 'teamsReset') {
        this.log.addSystemLog({ event });
    }

    addPlayer(player: Player) {
        this.players.push(player);
        this.emitGameState(player.socket);
        this.emitRoomState(player.socket);
        this.emitPlayers();
        this.logPlayerEvent(player, 'connected');
        if (player.username) {
            console.log(`${player.username} adicionado na sala ${this.name}`);
        } else {
            console.log(`Jogador sem nome foi adicionado na sala: ${this.name}`);
        }
    }

    removePlayer(id: string) {
        const foundPlayer = this.getPlayer(id)
        if (foundPlayer) {
            this.players = this.players.filter(p => p.id !== foundPlayer.id)

            if (this.players.length > 0) {

                if (foundPlayer.admin) {
                    this.players[0].admin = true
                }

                this.emitPlayers();
                this.logPlayerEvent(foundPlayer, 'disconnected');
            } else {
                roomManager.deleteRoom(this.id)
            }
        }
    }

    disconnectPlayer(id: string) {
        const player = this.players.find(p => p.id === id);
        if (player) {
            player.connected = false;
            this.emitPlayers();
            this.logPlayerEvent(player, 'disconnected');
            console.log(`${player.username} está offline`);
        }
    }

    addChatMessage(player: Player, message: string) {
        this.chat.addMessage(player.id, player.username, message)
    }

    getChatMessages() {
        return this.chat.getChatMessages();
    }

    getPlayer(id: string) {
        return this.players.find(p => p.id === id);
    }

    updatePlayerTeamAndRole(id: string, team: number, role: string) {
        const player = this.players.find(p => p.id === id);
        if (!player) return
        // if (this.status === 'playing' && player.role !== 'spectator') return

        player.role = role;
        player.team = team;

        this.logPlayerEvent(player, 'changeTeamRole');
        this.emitPlayers();
        this.emitGameState(player.socket)
        console.log(`${player.username} atualizado: role[${player.role}] e team[${player.team}]`);
    }

    updatePlayerSocket(id: string, socket: string) {
        const player = this.players.find(p => p.id === id);
        if (player) {
            player.socket = socket;
            console.log(`${player.username} socket atualizado para: ${player.socket}`);
        }
    }

    connectPlayer(id: string) {
        const player = this.players.find(p => p.id === id);
        if (player) {
            player.connected = true;
            this.emitPlayers();
            this.logPlayerEvent(player, 'connected');
            console.log(`${player.username} está online`);
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
            if (me.socket)
                this.io.to(me.socket).emit('roomPlayers', response)
        })
    }

    emitGameState(playerSocket?: string) {
        this.players.forEach(p => {
            const gameStateToSend = {
                turn: this.gameState.turn,
                phase: this.gameState.phase,
                clue: this.gameState.clue,
                teamsScore: this.gameState.teamsScore,
                winner: this.gameState.winner,
                board: (p.role === 'spymaster' || this.gameState.winner) ? this.gameState.board : this.gameState.getOperativeCards(),
                spymasterTurn: p.role === 'spymaster' && this.gameState.turn === p.team && this.gameState.phase === 1,
                operativeTurn: p.role === 'operative' && this.gameState.turn === p.team && this.gameState.phase === 2
            };
            if (!playerSocket || playerSocket === p.socket)
                if (p.socket)
                    this.io.to(p.socket).emit('gameState', gameStateToSend)
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
        this.logSystemEvent('teamsReset');
        this.emitPlayers();
    }

    restartGame() {
        this.status = 'waiting';
        this.logSystemEvent('gameReset');
        this.emitRoomState();
    }
}

