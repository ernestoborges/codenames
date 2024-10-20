import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { GameRoom } from '../../game/GameRoom';
import { randomNumberExclude } from '../../utils/functions';
import { Player } from '../../game/Player';
import roomManager from '../../game/rooms';
import { generateToken, verifyToken } from '../../utils/token';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método não permitido' });
    }

    const { playerName, roomName, avatar, token } = req.body;

    if (!playerName || !roomName) {
        return res.status(400).json({ message: 'Nome do jogador ou da sala não enviado' });
    }

    try {
        let decodedToken = verifyToken(token)
        if (decodedToken) {
            let { uuid } = decodedToken
            const rooms = roomManager.getAllRooms()
            rooms.forEach(room => {
                const foundPlayer = room.getPlayer(uuid)
                console.log('sala:', room.id)
                if (foundPlayer) {
                    console.log('jogador encontrado')
                    room.removePlayer(uuid)
                }
            })
        }
        const roomId = uuidv4();
        const newRoom = new GameRoom(roomId, roomName, global.io);

        const avatarNumber = avatar ? avatar : randomNumberExclude([], 1, 47);
        const player = new Player(uuidv4(), playerName, "", avatarNumber, true);

        newRoom.addPlayer(player);

        roomManager.addRoom(newRoom);

        const newToken = generateToken({ roomId, username: playerName, uuid: player.id });

        return res.status(200).json({ message: 'Sala criada com sucesso', token: newToken, roomId });
    } catch (error) {
        console.error('Erro ao criar sala:', error);
        return res.status(500).json({ message: 'Erro ao criar a sala' });
    }
}
