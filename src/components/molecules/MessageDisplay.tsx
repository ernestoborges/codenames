import { useEffect, useRef, useState } from "react";

export default function MessageDisplay({
    children
}) {

    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    const [isUserAtBottom, setIsUserAtBottom] = useState(true);

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
    }, [children, isUserAtBottom]);

    return (
        <>
            <ul
                className="flex flex-col w-full h-full overflow-y-scroll text-2xl"
                ref={messagesContainerRef}
                onScroll={handleScroll}
            >
                {children}
                <div ref={messagesEndRef} />
            </ul>
        </>
    )
}