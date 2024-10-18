import { GameRoom } from "./GameRoom";

export class RoomManager {
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

let roomManager: RoomManager;

if (!global.roomManager) {
    global.roomManager = new RoomManager();
}

roomManager = global.roomManager;

export default roomManager;
