import React from 'react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot'

  return (
    <div
      className={`flex ${
        isBot ? 'justify-start' : 'justify-end'
      } items-start space-x-2`}
    >
      <div
        className={`max-w-[70%] p-3 rounded-lg ${
          isBot
            ? 'bg-gray-100 dark:bg-gray-700'
            : 'bg-blue-500 text-white'
        }`}
      >
        <p className="text-sm">{message.text}</p>
        <span className="text-xs opacity-50 mt-1 block">
          {message.timestamp.toLocaleTimeString()}
        </span>
      </div>
    </div>
  )
}

export default ChatMessage