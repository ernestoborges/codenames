import React, { useEffect, useRef, useState } from 'react'

type MessageDisplayProps = {
  children: React.ReactNode
  className?: string
}

export default function MessageDisplay({
  children,
  className
}: MessageDisplayProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const messagesContainerRef = useRef<HTMLUListElement | null>(null)

  const [isUserAtBottom, setIsUserAtBottom] = useState(true)

  const scrollToBottom = () => {
    if (messagesEndRef && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleScroll = () => {
    const container = messagesContainerRef.current
    if (container) {
      const tolerance = 5
      const isAtBottom =
        Math.abs(
          container.scrollHeight - container.scrollTop - container.clientHeight
        ) <= tolerance
      setIsUserAtBottom(isAtBottom)
    }
  }

  useEffect(() => {
    if (isUserAtBottom) {
      scrollToBottom()
    }
  }, [children, isUserAtBottom])

  return (
    <ul
      className={`scrollbar flex h-full w-full flex-col overflow-y-scroll text-2xl ${className}`}
      ref={messagesContainerRef}
      onScroll={handleScroll}
    >
      {children}
      <div ref={messagesEndRef} />
    </ul>
  )
}
