export class Chat {
    private chatMessages: {
        senderId: string;
        sender: string;
        message: string;
        timestamp: Date;
    }[] = [];

    addMessage(senderId: string, sender: string, message: string) {
        const timestamp = new Date();
        this.chatMessages.push({ senderId, sender, message, timestamp });
    }

    getChatMessages() {
        return this.chatMessages.map(m => ({
            sender: m.sender,
            message: m.message,
            timestamp: m.timestamp
        }));
    }
}