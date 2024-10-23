export type GameState = {
  turn: number
  phase: 1 | 2
  clue: {
    word: string
    number: number
    remaining: number
  }
  board: Card[]
  teamsScore: {
    team1: number
    team2: number
  }
  spymasterTurn: boolean
  operativeTurn: boolean
  winner: 0 | 1 | 2
}

export type Player = {
  id: string
  username: string
  team: 0 | 1 | 2
  role: string
  admin: boolean
  avatar: number
  connected: boolean
  me?: boolean
}

export type RoomState = {
  name: string
  status: string
}

export type Card = {
  word: string
  color?: number
  position: number
  tips: string[]
  hidden: boolean
}

/* ----------------------- LOGS ----------------------- */

export type LogEvent = PlayerLogEvent | ActionLogEvent | SystemLogEvent

export type PlayerLogEvent = {
  type: 'player'
  player: Pick<Player, 'username' | 'role' | 'team'>
  event: 'connected' | 'disconnected' | 'changeTeamRole' | 'leave'
}

export type ActionLogEvent = {
  type: 'action'
  player: Pick<Player, 'username' | 'role' | 'team'>
  clue?: { word: string; number: number }
  flip?: { word: string; color: number }
  endTurn?: boolean
}

export type SystemLogEvent = {
  type: 'system'
  event:
    | 'gameStart'
    | 'gameOver'
    | 'roomCreated'
    | 'gameReset'
    | 'teamsReset'
    | 'endTurn'
  winner?: 1 | 2
}
