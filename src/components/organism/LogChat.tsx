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

    return (
        <div className="border rounded-lg p-4 flex flex-col gap-4 items-center w-[30rem] h-[20rem]">
            <div className="w-full">
                <ul className="w-full flex gap-4">
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
            <MessageDisplay>
                {
                    log.filter(c => {
                        if (filter.all) {
                            return true
                        } else {
                            switch (c.type) {
                                case 'action': return filter.action
                                case 'player': return filter.player
                                case 'system': return filter.system
                            }
                        }
                    }).map((c, i) =>
                        <li key={i}>
                            <div className="break-words">
                                <span className="font-bold">{c.message}</span>
                            </div>
                        </li>
                    )
                }
            </MessageDisplay>
        </div >
    )
}