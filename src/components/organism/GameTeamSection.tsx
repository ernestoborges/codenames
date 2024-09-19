import { Socket } from "socket.io"
import Button from "../atoms/Button"
import PlayerLabel from "../molecules/PlayerLabel"
import useSocket from "../../hooks/useSocket"

export default function GameTeamSection({ players, team }: { players: any, team: number }) {

    const { socket, token } = useSocket();

    return <>
        <div className='border-white border flex flex-col p-4 w-full gap-4'>
            <p>Time {team}</p>
            <div className="flex justify-between items-center">
                <p>Operative</p>
                <Button onClick={() => {
                    socket.emit('updateTeam', { token, team: `${team}`, role: 'operative' })
                }}>Entrar</Button>
            </div>
            <ul>
                {
                    players.filter(player => player.team === `${team}` && player.role === 'operative').map(player =>
                        <li key={player.id}>
                            <PlayerLabel name={player.username} isOnline={true} isAdmin={player.admin} />
                        </li>
                    )
                }
            </ul>
            <div className="flex justify-between items-center">
                <p>Spymaster</p>
                <Button onClick={() => {
                    socket.emit('updateTeam', { token, team: `${team}`, role: 'spymaster' })
                }}>Entrar</Button>
            </div>
            <ul>
                {
                    players.filter(player => player.team === `${team}` && player.role === 'spymaster').map(player =>
                        <li key={player.id}>
                            <PlayerLabel name={player.username} isOnline={true} isAdmin={player.admin} />
                        </li>
                    )
                }
            </ul>

        </div>
    </>
}