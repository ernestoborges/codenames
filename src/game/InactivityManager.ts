import { INACTIVITY_THRESHOLD } from '../conf/codenames.conf'
import { Player } from './Player'
import { RoomManager } from './rooms'

class InactivityManager {
  private roomManager: RoomManager

  constructor(roomManager: RoomManager) {
    this.roomManager = roomManager
  }

  checkInactiveUsers() {
    const currentTime = Date.now()

    this.roomManager.getAllRooms().forEach((room) => {
      room.players.forEach((player) => {
        if (this.isPlayerInactive(player, currentTime)) {
          console.log(`Jogador ${player.id} foi removido por inatividade.`)
          room.removePlayer(player.id)
        }
      })
    })
  }

  isPlayerInactive(player: Player, currentTime: number): boolean {
    return (
      player.connected === false &&
      currentTime - player.lastActive > INACTIVITY_THRESHOLD
    )
  }
}

export default InactivityManager
