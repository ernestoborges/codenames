import { useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import useSocket from "../../hooks/useSocket"
import MessageDisplay from "../molecules/MessageDisplay";
import ToggleButton from "../atoms/ToggleButton";

interface Message {
    sender: string,
    me: boolean,
    message: string,
    timestamp: string
}

export default function LogChat() {

    const { socket, token, connected } = useSocket();
    const [log, setLog] = useState<any[]>([]);
    const [filter, setFilter] = useState({
        all: true,
        action: false,
        player: false,
        error: false,
        system: false,
    })

    useEffect(() => {
        if (socket) {
            socket.on('roomLog', (log) => {
                setLog(log);
            })
        }
    }, [socket, connected, token])

    const handleSystemLog = ({ type }) => {
        switch (type) {
            case 'gameStart': return 'Jogo iniciado'
            case 'gameOver': return 'Fim de jogo'
            case 'roomCreated': return 'Sala criada'
            case 'gameReset': return 'Partida reiniciada'
            case 'teamsReset': return 'Times redefinidos'
            case 'endTurn': return 'Turno encerrado'
        }
    }

    const handlePlayerLog = ({ data, event }) => {
        switch (event) {
            case "connected": return "se conectou";
            case "disconnected": return "desconectou";
            case "changeTeamRole": return <>
                <span className="text-[#ffffff99]">mudou para</span>
                <div>{data.role}</div>
                <span className="text-[#ffffff99]">no time </span>
                <div>{data.team}</div>
            </>
            case "enteredRoom": return "entrou na sala"
        }
    }

    const handleActionLog = ({ flip, clue, endTurn }) => {
        if (flip) {
            return <>
                <span className="text-[#ffffff99]">
                    {"virou a carta"}
                </span>
                <div className="bg-[#00000044] px-2 py-1 rounded-lg">
                    {flip.word}
                </div>
            </>
        }
        if (clue) {
            return <>
                <span className="text-[#ffffff99]">
                    {" deu a palavra-chave: "}
                </span>
                <div className="bg-[#00000044] px-2 py-1 rounded-lg">
                    {clue.word}
                </div>
                <div className="bg-[#00000044] px-2 py-1 rounded-lg">
                    {clue.number}
                </div>
            </>
        }
        if (endTurn) {
            return <>
                <span className="text-[#ffffff99]">
                    {" encerrou o turno"}
                </span>
            </>
        }
    }

    const handleLogText = log => {
        switch (log.type) {
            case 'action': return <>
                <div
                    className={`${log.details.action.player.team === 1 ? "bg-[#143464aa]" : "bg-[#b4202aaa]"} w-full h-full break-words py-1 px-4 flex gap-2 items-center`}
                >
                    <span className="font-bold">
                        {log.details.action.player.username}
                    </span>
                    {handleActionLog(log.details.action)}
                </div>
            </>
            case 'player': return <>
                <div
                    className={`${true ? '' : log.details.player.data.team === 1 ? "bg-[#143464aa]" : "bg-[#b4202aaa]"} w-full h-full break-words py-1 px-4 flex gap-2 items-center`}
                >
                    <span className="font-bold">
                        {log.details.player.data.username}
                    </span>
                    {handlePlayerLog(log.details.player)}
                </div>
            </>
            case 'system': return <>
                <div className="w-full h-full break-words py-1 px-4 flex gap-2 items-center">
                    {handleSystemLog(log.details.system)}
                </div>
            </>
        }
    }

    return (
        <div className="border rounded-lg flex flex-col gap-4 items-center h-[36rem]">
            <div className="w-full p-4">
                <ul className="w-full flex gap-4 text-sm font-bold">
                    <li>
                        <ToggleButton
                            onClick={() => setFilter(prev => ({ ...prev, all: !prev.all }))}
                            value={filter.all}
                        >
                            tudo
                        </ToggleButton>
                    </li>
                    <li>
                        <ToggleButton
                            onClick={() => setFilter(prev => ({ ...prev, action: !prev.action }))}
                            value={filter.action}
                        >
                            ação
                        </ToggleButton>
                    </li>
                    <li>
                        <ToggleButton
                            onClick={() => setFilter(prev => ({ ...prev, player: !prev.player }))}
                            value={filter.player}
                        >
                            jogador
                        </ToggleButton>
                    </li>
                    <li>
                        <ToggleButton
                            onClick={() => setFilter(prev => ({ ...prev, system: !prev.system }))}
                            value={filter.system}
                        >
                            sistema
                        </ToggleButton>
                    </li>
                </ul>
            </div>
            <MessageDisplay className="text-base px-0">
                {
                    log.filter(m => {
                        if (filter.all) {
                            return true
                        } else {
                            switch (m.type) {
                                case 'action': return filter.action
                                case 'player': return filter.player
                                case 'system': return filter.system
                            }
                        }
                    }).map((m, i) =>
                        <li key={i}>
                            {handleLogText(m)}
                        </li>
                    )
                }
            </MessageDisplay>
        </div >
    )
}