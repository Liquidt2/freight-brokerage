import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'chatLead',
  title: 'Chat Leads',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
    }),
    defineField({
      name: 'conversations',
      title: 'Conversations',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'timestamp',
              title: 'Timestamp',
              type: 'datetime',
            },
            {
              name: 'messages',
              title: 'Messages',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'role',
                      title: 'Role',
                      type: 'string',
                      options: {
                        list: ['user', 'assistant'],
                      },
                    },
                    {
                      name: 'content',
                      title: 'Content',
                      type: 'text',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
    },
  },
})
