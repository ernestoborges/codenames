import { useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import MessageDisplay from "../molecules/MessageDisplay";
import { useSocketContext } from "../../context/socket";
import { useTokenContext } from "../../context/token";

interface Message {
    sender: string,
    me: boolean,
    message: string,
    timestamp: string
}

export default function Chat() {

    const { socket, connected } = useSocketContext();
    const { token } = useTokenContext();
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
        if (socket) {
            socket.on('chatUpdate', (newChat: Message[]) => {
                setChat(newChat);
            })
        }
    }, [socket, connected])

    return (
        <div className="border rounded-lg p-4 flex flex-col gap-4 items-center h-[20rem]">
            <MessageDisplay className="text-lg">
                {
                    chat.map((c, i) =>
                        <li key={i}>
                            {/* {i > 0 ? chat[i - 1].sender !== c.sender && <div>{c.sender} </div> : <div>{c.sender} </div>} */}
                            <div className="break-words">
                                <span className="font-bold">{c.sender}</span>: <span className="text-[#f0f0f0f0]">{c.message}</span>
                            </div>
                        </li>
                    )
                }
            </MessageDisplay>
            <form
                className="w-full bg-white flex"
                onSubmit={handleSendMessage}
            >
                <input
                    className='text-black w-full py-1 px-4 text-2xl'
                    value={message} onChange={(e) => setMessage(e.target.value)}
                />
                <button className="text-black flex items-center justify-center w-16">
                    <IoMdSend />
                </button>
            </form>
        </div>
    )
}