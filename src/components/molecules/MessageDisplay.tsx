import React, { useEffect, useRef, useState } from "react";

export default function MessageDisplay({
    children,
    className
}: {
    children: React.ReactNode,
    className?: string
}) {

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const messagesContainerRef = useRef<HTMLUListElement | null>(null);

    const [isUserAtBottom, setIsUserAtBottom] = useState(true);

    const scrollToBottom = () => {
        if (messagesEndRef && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleScroll = () => {
        const container = messagesContainerRef.current;
        if (container) {
            const tolerance = 5;
            const isAtBottom = Math.abs(container.scrollHeight - container.scrollTop - container.clientHeight) <= tolerance;
            setIsUserAtBottom(isAtBottom);
        }
    };

    useEffect(() => {
        if (isUserAtBottom) {
            scrollToBottom();
        }
    }, [children, isUserAtBottom]);

    return (
        <>
            <ul
                className={`flex flex-col w-full h-full overflow-y-scroll scrollbar text-2xl ${className}`}
                ref={messagesContainerRef}
                onScroll={handleScroll}
            >
                {children}
                <div ref={messagesEndRef} />
            </ul>
        </>
    )
}