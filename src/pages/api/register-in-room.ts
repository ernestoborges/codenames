import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { randomNumberExclude } from '../../utils/functions';
import { Player } from '../../game/Player';
import roomManager from '../../game/rooms';
import { generateToken } from '../../utils/token';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método não permitido' });
    }

    const { playerName, roomId } = req.body;

    if (!playerName || !roomId) {
        return res.status(400).json({ message: 'Nome do jogador ou da sala não enviado' });
    }

    try {
        const gameRoom = roomManager.getRoom(roomId)
        if (!gameRoom) return res.status(404).json({ message: 'Sala não encontrada' });

        const avatar = randomNumberExclude([], 1, 47);
        const player = new Player(uuidv4(), playerName, "", avatar, true);

        gameRoom.addPlayer(player);

        const token = generateToken({ roomId, username: playerName, uuid: player.id });

        return res.status(200).json({ token });
    } catch (error) {
        console.error('Erro ao criar sala:', error);
        return res.status(500).json({ message: 'Erro ao criar a sala' });
    }
}
