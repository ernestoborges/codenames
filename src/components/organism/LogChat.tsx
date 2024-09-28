import { useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import useSocket from "../../hooks/useSocket"
import MessageDisplay from "../molecules/MessageDisplay";

interface Message {
    sender: string,
    me: boolean,
    message: string,
    timestamp: string
}

export default function LogChat() {

    const { socket, token, connected } = useSocket();
    const [log, setLog] = useState<any[]>([]);

    useEffect(() => {
        if (socket) {
            socket.on('roomLog', (log) => {
                setLog(log);
            })
        }
    }, [socket, connected, token])

    return (
        <div className="border rounded-lg p-4 flex flex-col gap-4 items-center w-[30rem] h-[20rem]">
            <MessageDisplay>

                {
                    log.map((c, i) =>
                        <li key={i}>
                            <div className="break-words">
                                <span className="font-bold">{c.message}</span>
                            </div>
                        </li>
                    )
                }
            </MessageDisplay>
        </div>
    )
}