import { useState, useEffect } from 'react'
import { useChatSettings } from './use-chat-settings'

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatLead {
  name: string
  email: string
  company?: string
}

export interface UseChatReturn {
  messages: Message[]
  isLoading: boolean
  hasLead: boolean
  sendMessage: (content: string) => Promise<void>
  submitLead: (lead: ChatLead) => Promise<void>
  error: string | null
  remainingMessages: number
}

const STORAGE_KEY = 'chat-history'

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasLead, setHasLead] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { settings } = useChatSettings()
  const [remainingMessages, setRemainingMessages] = useState(settings.maxFreeMessages)

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY)
    if (savedHistory) {
      const { messages: savedMessages, hasLead: savedHasLead, remainingMessages: savedRemaining } = JSON.parse(savedHistory)
      setMessages(savedMessages)
      setHasLead(savedHasLead)
      setRemainingMessages(savedRemaining)
    }
  }, [])

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      messages,
      hasLead,
      remainingMessages
    }))
  }, [messages, hasLead, remainingMessages])

  const sendMessage = async (content: string) => {
    if (remainingMessages <= 0) {
      setError(settings.messages.maxMessagesReached)
      return
    }

    if (!hasLead) {
      setError(settings.messages.leadFormIntro)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Add user message to chat
      const userMessage: Message = { role: 'user', content }
      setMessages(prev => [...prev, userMessage])

      // Send message to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, messages: messages }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()

      // Add AI response to chat
      const aiMessage: Message = { role: 'assistant', content: data.message }
      setMessages(prev => [...prev, aiMessage])
      setRemainingMessages(prev => prev - 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const submitLead = async (lead: ChatLead) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/chat/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      })

      if (!response.ok) {
        throw new Error('Failed to submit lead information')
      }

      setHasLead(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    messages,
    isLoading,
    hasLead,
    sendMessage,
    submitLead,
    error,
    remainingMessages,
  }
}
