import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

interface ChatState {
  chats: Chat[]
  currentChatId: string | null
  createNewChat: () => void
  addMessage: (chatId: string, message: Message) => void
  setCurrentChat: (chatId: string) => void
  deleteChat: (chatId: string) => void
  updateChatTitle: (chatId: string, title: string) => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      chats: [],
      currentChatId: null,

      createNewChat: () => {
        const newChat: Chat = {
          id: Date.now().toString(),
          title: 'New Chat',
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        set((state) => ({
          chats: [newChat, ...state.chats],
          currentChatId: newChat.id,
        }))
      },

      addMessage: (chatId, message) => {
        set((state) => ({
          chats: state.chats.map((chat) => {
            if (chat.id === chatId) {
              return {
                ...chat,
                messages: [...chat.messages, message],
                updatedAt: new Date(),
                title:
                  chat.messages.length === 0
                    ? message.text.slice(0, 30) + '...'
                    : chat.title,
              }
            }
            return chat
          }),
        }))
      },

      setCurrentChat: (chatId) => {
        set({ currentChatId: chatId })
      },

      deleteChat: (chatId) => {
        set((state) => ({
          chats: state.chats.filter((chat) => chat.id !== chatId),
          currentChatId:
            state.currentChatId === chatId
              ? state.chats[1]?.id || null
              : state.currentChatId,
        }))
      },

      updateChatTitle: (chatId, title) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId ? { ...chat, title } : chat
          ),
        }))
      },
    }),
    {
      name: 'chat-store',
    }
  )
)