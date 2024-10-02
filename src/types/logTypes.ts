import { Player } from "../game/Player";

export type LogEvent = PlayerLogEvent | ActionLogEvent | SystemLogEvent;

export interface PlayerLogEvent {
    type: 'player';
    player: Pick<Player, 'username' | 'role' | 'team'>;
    event: 'connected' | 'disconnected' | 'changeTeamRole';
}

export interface ActionLogEvent {
    type: 'action';
    player: Pick<Player, 'username' | 'role' | 'team'>;
    clue?: { word: string, number: number };
    flip?: { word: string, color: number };
    endTurn?: boolean;
}

export interface SystemLogEvent {
    type: 'system';
    event: 'gameStart' | 'gameOver' | 'roomCreated' | 'gameReset' | 'teamsReset' | 'endTurn';
}