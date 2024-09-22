import { GameRoom } from "./GameRoom";

interface Room {
    id: string;
    name: string;
    players: any[];
    gameState: any;
    status: string;
    winner: number;
}

class RoomManager {
    private rooms: Map<string, GameRoom> = new Map();

    addRoom(room: GameRoom) {
        this.rooms.set(room.id, room);
    }

    getRoom(id: string): GameRoom | undefined {
        return this.rooms.get(id);
    }

    getAllRooms(): GameRoom[] {
        return Array.from(this.rooms.values());
    }
}

const roomManager = new RoomManager();
export default roomManager;
