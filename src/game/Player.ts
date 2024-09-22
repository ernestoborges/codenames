import { generateToken } from "../utils/token"

export class Player {
    public role: string
    public team: number
    public admin: boolean
    public connected: boolean

    constructor(
        public id: string,
        public username: string,
        public socket: string,
        admin?: boolean
    ) {
        this.role = 'spectator'
        this.team = 0
        this.admin = admin ? admin : false
        this.connected = false
    }
}