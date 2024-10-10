import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { GameRoom } from '../../game/GameRoom';
import { randomNumberExclude } from '../../utils/functions';
import { Player } from '../../game/Player';
import roomManager from '../../game/rooms';
import { generateToken } from '../../utils/token';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método não permitido' });
    }

    const { playerName, roomName } = req.body;

    if (!playerName || !roomName) {
        return res.status(400).json({ message: 'Nome do jogador ou da sala não enviado' });
    }

    try {
        const roomId = uuidv4();
        const newRoom = new GameRoom(roomId, roomName, global.io);
        console.log("Sala criada: ", newRoom)

        const avatar = randomNumberExclude([], 1, 47);
        const player = new Player(uuidv4(), playerName, "", avatar, true);

        newRoom.addPlayer(player);

        roomManager.addRoom(newRoom);
        console.log("Lista de salas: ", roomManager)

        const token = generateToken({ roomId, username: playerName, uuid: player.id });

        return res.status(200).json({ message: 'Sala criada com sucesso', token, roomId });
    } catch (error) {
        console.error('Erro ao criar sala:', error);
        return res.status(500).json({ message: 'Erro ao criar a sala' });
    }
}
