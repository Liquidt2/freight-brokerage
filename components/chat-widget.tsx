import { useState, useRef, useEffect } from 'react'
import { useChat } from '@/hooks/use-chat'
import type { Message } from '@/hooks/use-chat'
import { useChatSettings, getBubbleSize, getPositionStyles } from '@/hooks/use-chat-settings'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Send, X, Loader2, Phone } from 'lucide-react'
import { FreightBrokerIcon } from './freight-broker-icon'
import { zodResolver } from '@hookform/resolvers/zod'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { cn } from '@/lib/utils'

const leadFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  company: z.string().optional(),
})

type LeadFormValues = z.infer<typeof leadFormSchema>

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isTextVisible, setIsTextVisible] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [message, setMessage] = useState('')
  const { messages, isLoading, hasLead, sendMessage, submitLead, error, remainingMessages } = useChat()
  const { settings } = useChatSettings()

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
    },
  })

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const onSubmit = async (values: LeadFormValues) => {
    await submitLead(values)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    await sendMessage(message)
    setMessage('')
  }

  if (!isOpen) {
    return (
      <AnimatePresence>
        <motion.div
          style={getPositionStyles('bottom-right')}
          className="fixed flex items-center gap-3 z-50"
        >
          {/* Text bubble with close button */}
          {isTextVisible && (
            <>
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="glass-effect text-gray-600 p-1.5 rounded-full hover:bg-white/90 transition-colors"
                onClick={() => setIsTextVisible(false)}
              >
                <X className="w-4 h-4" />
              </motion.button>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-effect px-3 py-1.5 rounded-full shadow-md max-w-[200px]"
              >
                <p className="text-xs font-medium">Chat with our experts</p>
              </motion.div>
            </>
          )}

          {/* 3D Chat Button */}
          <motion.button
            onClick={() => setIsOpen(true)}
            style={{
              width: `${getBubbleSize(settings.styling.bubbleSize)}px`,
              height: `${getBubbleSize(settings.styling.bubbleSize)}px`,
              backgroundColor: settings.styling.primaryColor,
            }}
            className="rounded-full p-0 shadow-lg hover:shadow-xl transition-all duration-300 relative"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            whileHover={{
              scale: 1.05,
              rotateY: 180,
              transition: { duration: 0.3 }
            }}
          >
            <motion.div className="absolute inset-0 rounded-full bg-black/10 transform -skew-x-12" />
            <motion.div 
              className="relative flex items-center justify-center text-white"
              style={{ 
                filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.3))',
                transform: 'translateZ(10px)'
              }}
            >
              <FreightBrokerIcon />
            </motion.div>
          </motion.button>
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <Card 
      className="fixed w-[340px] h-[520px] shadow-xl flex flex-col z-50 glass-effect"
      style={getPositionStyles('bottom-right')}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold">{settings.title}</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Lead Form or Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {!hasLead ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{settings.leadForm.nameLabel}</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{settings.leadForm.emailLabel}</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{settings.leadForm.companyLabel}</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Start Chat'}
              </Button>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            {messages.map((msg: Message, i) => (
              <div
                key={i}
                className={cn(
                  'flex max-w-[80%] rounded-lg p-4',
                  msg.role === 'user'
                    ? 'text-white ml-auto'
                    : 'bg-muted mr-auto'
                )}
                style={msg.role === 'user' ? { backgroundColor: settings.styling.primaryColor } : {}}
              >
                {msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-4 py-2 text-sm text-red-500">
          {error}
        </div>
      )}

      {/* Remaining Messages Counter */}
      {hasLead && (
        <div className="px-4 py-2 text-sm text-muted-foreground">
          {remainingMessages} {remainingMessages === 1 ? 'message' : 'messages'} remaining
        </div>
      )}

      {/* Message Input */}
      {hasLead && (
        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !message.trim()}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </form>
      )}
    </Card>
  )
}
