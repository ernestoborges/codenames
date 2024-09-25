import { useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import useSocket from "../../hooks/useSocket"

interface Message {
    sender: string,
    me: boolean,
    message: string,
    timestamp: string
}

export default function Chat() {

    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const [isUserAtBottom, setIsUserAtBottom] = useState(true);

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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleScroll = () => {
        const container = messagesContainerRef.current;
        const isAtBottom = container.scrollHeight - container.scrollTop === container.clientHeight;
        setIsUserAtBottom(isAtBottom);
    };

    useEffect(() => {
        if (isUserAtBottom) {
            scrollToBottom();
        }
    }, [chat, isUserAtBottom]);

    useEffect(() => {
        if (socket && connected && token) {
            socket.on('chatUpdate', (newChat: Message[]) => {
                setChat(newChat);
            })
        }
    }, [socket, connected, token])

    return (
        <div className="border rounded-lg p-4 flex flex-col gap-4 items-center w-[30rem] h-[40rem]">
            <ul
                className="flex flex-col w-full h-full overflow-y-scroll text-2xl"
                ref={messagesContainerRef}
                onScroll={handleScroll}
            >
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
                <div ref={messagesEndRef} />
            </ul>
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