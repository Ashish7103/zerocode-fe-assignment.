import React from 'react'
import { Plus, MessageSquare, Trash2 } from 'lucide-react'
import { useChatStore } from '../store/chatStore'
import { format } from 'date-fns'

const ChatSidebar = () => {
  const { chats, currentChatId, createNewChat, setCurrentChat, deleteChat } =
    useChatStore()

  return (
    <div className="w-64 bg-gray-800 h-full flex flex-col">
      <button
        onClick={createNewChat}
        className="flex items-center gap-2 m-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus size={20} />
        New Chat
      </button>

      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-700 ${
              chat.id === currentChatId ? 'bg-gray-700' : ''
            }`}
            onClick={() => setCurrentChat(chat.id)}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <MessageSquare size={18} className="text-gray-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{chat.title}</p>
                <p className="text-xs text-gray-400">
                  {format(new Date(chat.updatedAt), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                deleteChat(chat.id)
              }}
              className="p-1 hover:bg-gray-600 rounded"
            >
              <Trash2 size={16} className="text-gray-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChatSidebar