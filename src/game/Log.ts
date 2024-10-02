import { getSocketServerInstance } from "../socket";
import { ActionLogEvent, LogEvent, PlayerLogEvent, SystemLogEvent } from "../types/logTypes";
import { Player } from "./Player";

export class Log {
    private logs: LogEvent[] = [];
    private roomId: string

    constructor(id: string) {
        this.roomId = id
    }
    
    emitLog() {
        getSocketServerInstance().to(this.roomId).emit('roomLog', this.logs)
    }

    addPlayerLog(player: Player, event: 'connected' | 'disconnected' | 'changeTeamRole') {
        const logEntry: PlayerLogEvent = {
            type: 'player',
            player: {
                role: player.role,
                username: player.username,
                team: player.team
            },
            event
        };
        this.logs.push(logEntry);
        this.emitLog()
    }

    addActionLog({
        player,
        clue,
        flip,
        endTurn
    }: {
        player: Pick<Player, 'username' | 'role' | 'team'>,
        clue?: { word: string, number: number },
        flip?: { word: string, color: number },
        endTurn?: boolean
    }) {
        const logEntry: ActionLogEvent = {
            type: 'action',
            player: {
                role: player.role,
                username: player.username,
                team: player.team
            },
            clue,
            flip,
            endTurn
        };
        this.logs.push(logEntry);
        this.emitLog()
    }

    addSystemLog(event: 'gameStart' | 'gameOver' | 'roomCreated' | 'gameReset' | 'teamsReset' | 'endTurn') {
        const logEntry: SystemLogEvent = {
            type: 'system',
            event
        };
        this.logs.push(logEntry);
        this.emitLog()
    }

    getLogs(): LogEvent[] {
        return this.logs;
    }

    clearLogs() {
        this.logs = [];
    }
}
