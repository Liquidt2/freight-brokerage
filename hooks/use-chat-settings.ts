import { useEffect, useState } from 'react'
import { getClient } from '@/lib/sanity/client'
import { chatSettingsQuery } from '@/lib/sanity/queries'

export interface ChatSettings {
  title: string
  systemPrompt: string
  maxFreeMessages: number
  styling: {
    primaryColor: string
    bubbleSize: 'small' | 'medium' | 'large'
    position: 'bottom-right' | 'bottom-left'
  }
  leadForm: {
    companyFieldRequired: boolean
    nameLabel: string
    emailLabel: string
    companyLabel: string
  }
  messages: {
    welcomeMessage: string
    leadFormIntro: string
    maxMessagesReached: string
  }
}

const defaultSettings: ChatSettings = {
  title: 'Chat with us',
  systemPrompt: 'You are a helpful freight brokerage assistant...',
  maxFreeMessages: 5,
  styling: {
    primaryColor: '#007bff',
    bubbleSize: 'large',
    position: 'bottom-right', // Always bottom-right now
  },
  leadForm: {
    companyFieldRequired: false,
    nameLabel: 'Name',
    emailLabel: 'Email',
    companyLabel: 'Company (Optional)',
  },
  messages: {
    welcomeMessage: 'Hello! How can I help you today?',
    leadFormIntro: 'Please provide your contact information to start chatting.',
    maxMessagesReached: 'You have reached the maximum number of free messages. Please contact us for more.',
  },
}

export function useChatSettings() {
  const [settings, setSettings] = useState<ChatSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      let retries = 3
      while (retries > 0) {
        try {
          setError(null)
          const client = getClient(false)
          const fetchedSettings = await client.fetch(chatSettingsQuery)
          
          if (fetchedSettings) {
            setSettings(fetchedSettings)
            return // Success, exit retry loop
          } else {
            throw new Error('No chat settings found')
          }
        } catch (error) {
          console.error('Failed to fetch chat settings:', error)
          retries--
          if (retries === 0) {
            setError(error instanceof Error ? error.message : 'Failed to load chat settings')
          } else {
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, (3 - retries) * 1000))
          }
        }
      }
      setIsLoading(false)
    }

    fetchSettings()

    // Revalidate settings every 5 minutes
    const interval = setInterval(fetchSettings, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return {
    settings,
    isLoading,
    error
  }
}

// Helper function to get bubble size in pixels
export function getBubbleSize(size: ChatSettings['styling']['bubbleSize']) {
  switch (size) {
    case 'small':
      return 40
    case 'large':
      return 56
    default:
      return 48 // medium
  }
}

// Helper function to get position styles
export function getPositionStyles(position: ChatSettings['styling']['position']) {
  switch (position) {
    case 'bottom-right':
      return {
        bottom: '2rem',
        right: '2rem',
      }
    case 'bottom-left':
      return {
        bottom: '2rem',
        left: '2rem',
      }
    default:
      return {
        bottom: '2rem',
        right: '2rem',
      }
  }
}
