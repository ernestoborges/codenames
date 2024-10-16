import { useContext, useEffect, useState } from "react";
import Button from "../atoms/Button";
import ClueInput from "../molecules/ClueInput";
import Chat from "../organism/Chat";
import GameBoard from "../organism/GameBoard";
import GameTeamSection from "../organism/GameTeamSection";
import LogChat from "../organism/LogChat";
import ScoreBoard from "../organism/ScoreBoard";
import { useParams } from 'next/navigation';
import { useSocketContext } from "../../context/socket";
import { useTokenContext } from "../../context/token";

interface Player {
    id: string;
    username: string;
    team: string;
    role: string;
    admin: boolean;
}

interface GameState {
    turn: number,
    clue: {
        word: string,
        number: number,
        remaining: number
    },
    board: string[],
    teamsScore: {
        team1: number,
        team2: number
    },
    spymasterTurn: boolean,
    operativeTurn: boolean
}

interface RoomState {
    name: string,
    status: string
}

export default function GameRoom() {
    const { socket, connected } = useSocketContext();
    const { token } = useTokenContext();
    const { roomId } = useParams();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [players, setPlayers] = useState<Player[]>([]);
    const [roomState, setRoomState] = useState<RoomState | null>(null);
    const [gameState, setGameState] = useState<GameState | null>(null);

    useEffect(() => {
        if (socket && connected) {

            socket.on('roomPlayers', (players) => {
                setPlayers(players);
            })

            socket.on('gameState', (gameState) => {
                setGameState(gameState);
            })

            socket.on('roomState', (roomState) => {
                setRoomState(roomState)
            })

            if (isLoading) {
                socket.emit("joinRoom")
                setIsLoading(false)
            }

            return () => {
                // socket.off('roomState');
                // socket.off('receiveMessage');
                // socket.off('allowCheckin');
            };
        }
    }, [socket, connected]);

    if (isLoading) {
        return <>
            <button onClick={() => socket.emit('sync')}>sync</button>
            <div>calma po</div>
        </>
    }

    if (!roomState || !gameState || !players) {
        return <div>carregando</div>
    }

    return (
        <div
            className="p-4 h-screen"
            style={{
                // backgroundColor: '#e5e5f7',
                backgroundImage: 'linear-gradient(0deg, #1a1a1a1a 50%, #3a3a3a3a 50%)',
                backgroundSize: '10px 10px'
            }}>
            <div className='flex gap-2 items-start justify-between'>
                <div className='flex flex-col items-center min-w-[15rem] max-w-[25rem] w-full gap-4'>
                    <GameTeamSection players={players} team={1} score={gameState.teamsScore.team1} roomState={roomState} />
                    <GameTeamSection players={players} team={2} score={gameState.teamsScore.team2} roomState={roomState} />
                </div>
                <div className='h-full flex items-center'>
                    {
                        roomState.status === 'waiting'
                            ?
                            <>
                                <div className='bg-gray-100 rounded-sm flex flex-col p-4 gap-4'>
                                    <div className='p-8'>
                                        Esperando jogadores
                                    </div>
                                    <div className='flex gap-4'>
                                        <Button onClick={() => socket.emit('gameResetTeams', { token })}>
                                            Reiniciar Time
                                        </Button>
                                        <Button onClick={() => socket.emit('startGame', { token, roomId })}>
                                            Iniciar Jogo
                                        </Button>
                                    </div>
                                </div>
                            </>
                            :
                            <>
                                <div className='flex flex-col items-center gap-4'>
                                    <ScoreBoard gameState={gameState} />
                                    <GameBoard cards={gameState.board} operativeTurn={gameState.operativeTurn} />
                                    {
                                        gameState.spymasterTurn &&
                                        <ClueInput gameState={gameState} />
                                    }
                                    {
                                        gameState.operativeTurn &&
                                        <Button className='px-4' onClick={() => socket.emit('gameEndTurn', { token })}>Encerrar turno</Button>
                                    }
                                </div>
                            </>
                    }
                </div>
                <div className='flex flex-col gap-4 w-[24rem]'>
                    <Button onClick={() => socket.emit('restartGame', { token })}>
                        Reiniciar jogo
                    </Button>
                    <LogChat />
                    <Chat />
                </div>
            </div>

        </div >
    );
}