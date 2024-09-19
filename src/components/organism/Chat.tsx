import { useEffect, useState } from "react";
import useSocket from "../../hooks/useSocket"

interface Message {
    username: string,
    message: string,
    timestamp: string
}

export default function Chat() {

    const { socket, token, connected } = useSocket();
    const [chat, setChat] = useState<Message[]>([]);
    const [message, setMessage] = useState<string>("");


    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (socket && message && token) {
            socket.emit('sendMessage', { token, message });
            setMessage('');
        }
    }

    useEffect(() => {
        if (socket && connected && token) {
            socket.on('receiveMessage', (newMessage: Message) => {
                setChat((prevChat) => [...prevChat, newMessage]);
            })
        }
    }, [socket, connected, token])

    return (
        <div className="border rounded-lg p-4 flex flex-col gap-4 items-center">
            <ul className="flex flex-col w-full overflow-y-scroll">
                {
                    chat.map((c, i) =>
                        <li key={i}>
                            {i > 0 ? chat[i - 1].username !== c.username && <div>{c.username} </div> : <div>{c.username} </div>}
                            <div>{c.message}</div>
                        </li>
                    )
                }
            </ul>
            <form onSubmit={handleSendMessage}>
                <input className='text-black'
                    value={message} onChange={(e) => setMessage(e.target.value)}
                />
                <button>Send</button>
            </form>
        </div>
    )
}