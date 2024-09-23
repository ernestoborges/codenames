import { Socket } from "socket.io"
import Button from "../atoms/Button"
import PlayerLabel from "../molecules/PlayerLabel"
import useSocket from "../../hooks/useSocket"

export default function GameTeamSection({
    players,
    team,
    score
}: {
    players: any,
    team: number,
    score: number
}) {

    const { socket, token } = useSocket();

    return <>
        <div className='border-white border-2 flex flex-col w-full gap-2'>
            <p>Time {team}</p>
            <p>{score}</p>
            <div className="flex justify-between items-center bg-white text-black w-full">
                <p>Operative</p>
                <Button onClick={() => {
                    socket.emit('updateTeam', { token, team, role: 'operative' })
                }}>Entrar</Button>
            </div>
            <ul>
                {
                    players.filter(player => player.team === team && player.role === 'operative').map(player =>
                        <li key={player.id}>
                            <PlayerLabel name={player.username} isOnline={true} isAdmin={player.admin} />
                        </li>
                    )
                }
            </ul>
            <div className="flex justify-between items-center bg-white text-black w-full">
                <p>Spymaster</p>
                <Button onClick={() => {
                    socket.emit('updateTeam', { token, team, role: 'spymaster' })
                }}>Entrar</Button>
            </div>
            <ul>
                {
                    players.filter(player => player.team === team && player.role === 'spymaster').map(player =>
                        <li key={player.id}>
                            <PlayerLabel name={player.username} isOnline={true} isAdmin={player.admin} />
                        </li>
                    )
                }
            </ul>

        </div>
    </>
}