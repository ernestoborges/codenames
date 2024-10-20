import { NextApiRequest, NextApiResponse } from 'next';
import roomManager from '../../game/rooms';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Método não permitido' });
    }

    try {
        const rooms = roomManager.getAllRooms();

        const response = rooms.map(room => ({
            name: room.name,
            status: room.status,
            players: room.players.length,
            id: room.id 
        }))

        return res.status(200).json(response);
    } catch (error) {
        console.error('Erro ao listar salas :', error);
        return res.status(500).json({ message: 'Erro ao listar salas' });
    }
}
