import { Socket } from "socket.io"
import Button from "../atoms/Button"
import PlayerLabel from "../molecules/PlayerLabel"
import useSocket from "../../hooks/useSocket"
import PlaceholderLabel from "../molecules/PlaceholderLabel"
import { useEffect, useState } from "react"
import { RxEnter } from "react-icons/rx";

export default function GameTeamSection({
    players,
    team,
    score,
    roomState
}: {
    players: any,
    team: number,
    score: number,
    roomState: {
        name: string,
        status: string
    }
}) {

    const { socket, token } = useSocket();

    const me = players.find(p => p.me);

    return <>
        <div
            className={`border-white border-2 flex flex-col w-full text-2xl`}
            style={{
                backgroundColor: team === 1 ? '#143464' : '#b4202a'
            }}
        >
            <div className={`p-2 flex justify-between`}>
                <p>Time {team}</p>
                <p>{score}</p>
            </div>
            <div className="flex justify-between items-center bg-white text-black w-full ">
                <p className="py-2">Operative</p>
                {
                    (roomState.status == 'playing' || me.role === 'spectator') &&
                    (me.team !== team || me.role !== 'operative') &&
                    <>
                        <Button
                            className="p-2 flex items-center"
                            onClick={() => {
                                socket.emit('updateTeam', { token, team, role: 'operative' })
                            }}
                        >
                            <RxEnter />
                        </Button>
                    </>
                }
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
                    Array.from({ length: Math.max(0, 5 - players.filter(player => player.team === team && player.role === 'operative').length) }, (_, i) => (
                        <li key={1 + i + players.filter(player => player.team === team && player.role === 'operative').length}>
                            <PlayerLabel isPlaceholder={true} />
                        </li>
                    ))
                }
            </ul>
            <div className="flex justify-between items-center bg-white text-black w-full">
                <p className="py-2">Spymaster</p>
                {
                    (roomState.status == 'playing' || me.role === 'spectator') &&
                    (me.team !== team || me.role !== 'spymaster') &&
                    <>
                        <Button
                            className="p-2 flex items-center"
                            onClick={() => {
                                socket.emit('updateTeam', { token, team, role: 'spymaster' })
                            }}
                        >
                            <RxEnter />
                        </Button>
                    </>
                }
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
                    Array.from({ length: Math.max(0, 2 - players.filter(player => player.team === team && player.role === 'spymaster').length) }, (_, i) => (
                        <li key={1 + i + players.filter(player => player.team === team && player.role === 'spymaster').length}>
                            <PlayerLabel isPlaceholder={true} />
                        </li>
                    ))
                }
            </ul>

        </div>
    </>
}