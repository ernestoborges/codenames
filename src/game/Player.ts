export class Player {
  public role: string
  public team: 0 | 1 | 2
  public admin: boolean
  public connected: boolean
  public lastActive: number

  constructor(
    public id: string,
    public username: string,
    public socket: string,
    public avatar: number,
    admin?: boolean
  ) {
    this.role = 'spectator'
    this.team = 0
    this.admin = admin ? admin : false
    this.connected = false
    this.avatar = avatar
    this.lastActive = Date.now()
  }
}
