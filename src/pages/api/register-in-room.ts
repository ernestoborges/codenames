import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { randomNumberExclude } from '../../utils/functions';
import { Player } from '../../game/Player';
import roomManager from '../../game/rooms';
import { generateToken, verifyToken } from '../../utils/token';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método não permitido' });
    }

    const { playerName, roomId, avatar, token } = req.body;

    if (!playerName || !roomId) {
        return res.status(400).json({ message: 'Nome do jogador ou da sala não enviado' });
    }

    try {
        const gameRoom = roomManager.getRoom(roomId)
        if (!gameRoom) return res.status(404).json({ message: 'Sala não encontrada' });

        let decodedToken = verifyToken(token)
        if (decodedToken) {
            let { uuid, roomId } = decodedToken
            if (roomId === gameRoom.id) {
                const foundPlayer = gameRoom.getPlayer(uuid)
                if (foundPlayer) {
                    return res.status(200).json({ token, roomId });
                }
            }
            const rooms = roomManager.getAllRooms()
            rooms.forEach(room => {
                const foundPlayer = room.getPlayer(uuid)
                if (foundPlayer) {
                    room.removePlayer(uuid)
                }
            })
        }

        const foundPlayer = gameRoom.players.find(p => p.username === playerName)
        if (foundPlayer) return res.status(403).json({ message: 'Já existe um jogador com esse nome' })

        const avatarNumber = avatar ? avatar : randomNumberExclude([], 1, 47);
        const player = new Player(uuidv4(), playerName, "", avatarNumber, false);
        gameRoom.addPlayer(player);
        const newToken = generateToken({ roomId, username: playerName, uuid: player.id });

        return res.status(200).json({ token: newToken, roomId });
    } catch (error) {
        console.error('Erro ao criar sala:', error);
        return res.status(500).json({ message: 'Erro ao criar a sala' });
    }
}
