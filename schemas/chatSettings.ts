import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'chatSettings',
  title: 'Chatbot Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Chat Window Title',
      type: 'string',
      initialValue: 'Chat with us',
    }),
    defineField({
      name: 'systemPrompt',
      title: 'AI System Prompt',
      type: 'text',
      description: 'Instructions for how the AI assistant should behave',
      initialValue: `You are a helpful freight brokerage assistant. Use content from our blog posts and FAQs to inform your responses when relevant.

If you don't find relevant information in the provided content, you can still provide general helpful responses about freight brokerage. Always be professional and courteous.

Keep responses concise and focused on freight brokerage topics. If asked about topics unrelated to freight brokerage, politely redirect the conversation to relevant services.`,
    }),
    defineField({
      name: 'maxFreeMessages',
      title: 'Max Free Messages',
      type: 'number',
      description: 'Maximum number of free messages per session',
      initialValue: 5,
      validation: (Rule) => Rule.min(1).max(100),
    }),
    defineField({
      name: 'styling',
      title: 'Chat Widget Styling',
      type: 'object',
      fields: [
        {
          name: 'primaryColor',
          title: 'Primary Color',
          type: 'string',
          description: 'Hex color code (e.g., #007bff)',
          initialValue: '#007bff',
        },
        {
          name: 'bubbleSize',
          title: 'Chat Bubble Size',
          type: 'string',
          options: {
            list: ['small', 'medium', 'large'],
          },
          initialValue: 'medium',
        },
        {
          name: 'position',
          title: 'Widget Position',
          type: 'string',
          options: {
            list: ['bottom-right', 'bottom-left'],
          },
          initialValue: 'bottom-right',
        },
      ],
    }),
    defineField({
      name: 'leadForm',
      title: 'Lead Form Settings',
      type: 'object',
      fields: [
        {
          name: 'companyFieldRequired',
          title: 'Company Field Required',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'nameLabel',
          title: 'Name Field Label',
          type: 'string',
          initialValue: 'Name',
        },
        {
          name: 'emailLabel',
          title: 'Email Field Label',
          type: 'string',
          initialValue: 'Email',
        },
        {
          name: 'companyLabel',
          title: 'Company Field Label',
          type: 'string',
          initialValue: 'Company (Optional)',
        },
      ],
    }),
    defineField({
      name: 'messages',
      title: 'Custom Messages',
      type: 'object',
      fields: [
        {
          name: 'welcomeMessage',
          title: 'Welcome Message',
          type: 'string',
          initialValue: 'Hello! How can I help you today?',
        },
        {
          name: 'leadFormIntro',
          title: 'Lead Form Introduction',
          type: 'string',
          initialValue: 'Please provide your contact information to start chatting.',
        },
        {
          name: 'maxMessagesReached',
          title: 'Max Messages Reached',
          type: 'string',
          initialValue: 'You have reached the maximum number of free messages. Please contact us for more.',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        title: 'Chatbot Settings',
        subtitle: `Window Title: ${title}`,
      }
    },
  },
})
