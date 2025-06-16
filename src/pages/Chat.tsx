import React, { useState, useRef, useEffect } from 'react'
import { Mic, Send, Download } from 'lucide-react'
import ChatMessage from '../components/ChatMessage'
import PromptTemplate from '../components/PromptTemplate'
import ChatSidebar from '../components/ChatSidebar'
import PDFExportButton from '../components/PDFExport'
import { useChatStore } from '../store/chatStore'
import { useAuth } from '../context/AuthContext'

const Chat = () => {
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()

  const {
    chats,
    currentChatId,
    createNewChat,
    addMessage,
  } = useChatStore()

  const currentChat = chats.find((chat) => chat.id === currentChatId)

  useEffect(() => {
    if (!currentChatId && chats.length === 0) {
      createNewChat()
    }
  }, [currentChatId, chats.length, createNewChat])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [currentChat?.messages])

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('')

        setInput(transcript)
      }

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsRecording(false)
      }

      recognition.onend = () => {
        setIsRecording(false)
      }

      setRecognition(recognition)
    }
  }, [])

  const getMockBotResponse = (userMessage: string): string => {
    const responses = {
      hello: "Hello! How can I help you today?",
      help: "I'm here to help! What would you like to know?",
      bye: "Goodbye! Have a great day!",
      default: "I understand. Please tell me more about that."
    }

    const lowercaseMessage = userMessage.toLowerCase()
    
    if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi')) {
      return responses.hello
    } else if (lowercaseMessage.includes('help')) {
      return responses.help
    } else if (lowercaseMessage.includes('bye')) {
      return responses.bye
    }
    
    return responses.default
  }

  const handleSend = () => {
    if (!input.trim() || !currentChatId) return

    const userMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user' as const,
      timestamp: new Date()
    }

    addMessage(currentChatId, userMessage)
    setInput('')

    setTimeout(() => {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: getMockBotResponse(userMessage.text),
        sender: 'bot' as const,
        timestamp: new Date()
      }
      addMessage(currentChatId, botMessage)
    }, 1000)
  }

  const handleVoiceInput = () => {
    if (!recognition) return

    if (isRecording) {
      recognition.stop()
    } else {
      recognition.start()
    }
    setIsRecording(!isRecording)
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <ChatSidebar />
      
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            {currentChat?.title || 'New Chat'}
          </h1>
          {currentChat && (
            <PDFExportButton
              messages={currentChat.messages}
              title={currentChat.title}
            />
          )}
        </div>

        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto space-y-4 p-4"
        >
          {currentChat?.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>

        <div className="p-4 border-t dark:border-gray-700">
          <PromptTemplate onSelect={text => setInput(text)} />

          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-4 rounded-lg">
            <button
              onClick={handleVoiceInput}
              className={`p-2 rounded-full ${
                isRecording
                  ? 'bg-red-500 text-white'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              } transition-colors duration-200`}
              title={isRecording ? 'Stop recording' : 'Start recording'}
            >
              <Mic className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 bg-transparent border-none outline-none text-gray-800 dark:text-white"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Send className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat