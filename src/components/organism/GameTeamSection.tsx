import { Socket } from "socket.io"
import Button from "../atoms/Button"
import PlayerLabel from "../molecules/PlayerLabel"
import useSocket from "../../hooks/useSocket"
import PlaceholderLabel from "../molecules/PlaceholderLabel"

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
        <div className={`bg-${team === 1 ? 'blue' : 'red' } border-white border-2 flex flex-col w-full text-2xl`}>
            <div className={`p-2 border-b-2 flex justify-between`}>
                <p>Time {team}</p>
                <p>{score}</p>
            </div>
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
                            <PlayerLabel name={player.username} isOnline={true} isAdmin={player.admin} avatar={player.avatar} />
                        </li>
                    )
                }
                {
                    Array.from({ length: Math.max(0, 5 - players.filter(player => player.team === team && player.role === 'operative').length)}, (_, i) => (
                        <li key={i}>
                            <PlayerLabel isPlaceholder={true} />
                        </li>
                    ))
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
                            <PlayerLabel name={player.username} isOnline={true} isAdmin={player.admin} avatar={player.avatar} />
                        </li>
                    )
                }
                {
                    Array.from({ length: Math.max(0, 2 - players.filter(player => player.team === team && player.role === 'spymaster').length)}, (_, i) => (
                        <li key={i}>
                            <PlayerLabel isPlaceholder={true} />
                        </li>
                    ))
                }
            </ul>

        </div>
    </>
}