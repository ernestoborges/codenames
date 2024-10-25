import { Server } from 'socket.io'

export class Chat {
  private chatMessages: {
    senderId: string
    sender: string
    message: string
    timestamp: Date
  }[] = []
  private roomId: string

  constructor(
    id: string,
    public io: Server
  ) {
    this.roomId = id
  }

  addMessage(senderId: string, sender: string, message: string) {
    const timestamp = new Date()
    this.chatMessages.push({ senderId, sender, message, timestamp })
    this.emitChat()
  }

  emitChat(playerSocket?: string) {
    if (playerSocket) {
      this.io.to(playerSocket).emit('chatUpdate', this.getChatMessages())
    } else {
      this.io.to(this.roomId).emit('chatUpdate', this.getChatMessages())
    }
  }

  getChatMessages() {
    return this.chatMessages.map((m) => ({
      sender: m.sender,
      message: m.message,
      timestamp: m.timestamp
    }))
  }
}
