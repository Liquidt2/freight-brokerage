import { defineField, defineType } from 'sanity';

// Form field type definition (not exported)
const formField = {
  name: 'formField',
  title: 'Form Field',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: Rule => Rule.required().min(2).error("Label is required and must be at least 2 characters."),
    }),
    defineField({
      name: 'name',
      title: 'Field Name',
      type: 'string',
      validation: Rule => Rule.required().error("Field name is required."),
    }),
    defineField({
      name: 'type',
      title: 'Field Type',
      type: 'string',
      options: {
        list: [
          { title: 'Text', value: 'text' },
          { title: 'Email', value: 'email' },
          { title: 'Phone', value: 'tel' },
          { title: 'Textarea', value: 'textarea' },
          { title: 'Select', value: 'select' },
          { title: 'Checkbox', value: 'checkbox' },
          { title: 'Radio', value: 'radio' },
          { title: 'Date', value: 'date' },
        ],
      },
      validation: Rule => Rule.required().error("Field type is required."),
    }),
    defineField({
      name: 'placeholder',
      title: 'Placeholder',
      type: 'string',
    }),
    defineField({
      name: 'required',
      title: 'Required',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'options',
      title: 'Options',
      type: 'array',
      of: [{
        type: 'object',
        name: 'option',
        fields: [
          {
            name: 'value',
            type: 'string',
            title: 'Option Value'
          }
        ],
        preview: {
          select: {
            title: 'value'
          }
        }
      }],
      options: {
        sortable: true
      },
      hidden: ({ parent }) => !['select', 'radio'].includes(parent?.type || ''),
    }),
  ],
};

// Compliance field type definition (not exported)
const complianceField = {
  name: 'complianceField',
  title: 'Compliance Field',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Consent Text',
      type: 'string',
      validation: Rule => Rule.required().error("Consent text is required."),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Consent', value: 'consent' },
          { title: 'Opt-in', value: 'opt-in' },
          { title: 'Opt-out', value: 'opt-out' },
        ],
      },
      validation: Rule => Rule.required().error("Compliance type is required."),
    }),
    defineField({
      name: 'required',
      title: 'Required',
      type: 'boolean',
      initialValue: true,
    }),
  ],
};

// Form schema
const formSchema = defineType({
  name: 'form',
  title: 'Forms',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Form Name',
      type: 'string',
      validation: Rule => Rule.required().min(3).error("Form name is required and must be at least 3 characters."),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 100 },
      validation: Rule => Rule.required().error("Slug is required."),
    }),
    defineField({
      name: 'title',
      title: 'Form Title',
      type: 'string',
      validation: Rule => Rule.required().error("Form title is required."),
    }),
    defineField({
      name: 'description',
      title: 'Form Description',
      type: 'text',
    }),
    defineField({
      name: 'fields',
      title: 'Form Fields',
      type: 'array',
      of: [formField],
      options: {
        sortable: true
      },
      validation: Rule => Rule.required().min(1).error("At least one form field is required."),
    }),
    defineField({
      name: 'complianceFields',
      title: 'Compliance Fields',
      type: 'array',
      of: [complianceField],
      options: {
        sortable: true
      },
      description: "Legal compliance fields like privacy policy agreements and SMS opt-in/out.",
    }),
    defineField({
      name: 'submitButton',
      title: 'Submit Button',
      type: 'object',
      fields: [
        defineField({
          name: 'text',
          title: 'Button Text',
          type: 'string',
          initialValue: 'Submit',
        }),
        defineField({
          name: 'loadingText',
          title: 'Loading Text',
          type: 'string',
          initialValue: 'Submitting...',
        }),
      ],
    }),
    defineField({
      name: 'successMessage',
      title: 'Success Message',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          initialValue: 'Success!',
        }),
        defineField({
          name: 'message',
          title: 'Message',
          type: 'text',
          initialValue: 'Your form has been submitted successfully.',
        }),
      ],
    }),
    defineField({
      name: 'errorMessage',
      title: 'Error Message',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          initialValue: 'Error',
        }),
        defineField({
          name: 'message',
          title: 'Message',
          type: 'text',
          initialValue: 'There was an error submitting your form. Please try again.',
        }),
      ],
    }),
    defineField({
      name: 'notifications',
      title: 'Notifications',
      type: 'object',
      fields: [
        defineField({
          name: 'adminEmail',
          title: 'Admin Email',
          type: 'string',
          validation: Rule => Rule.email(),
        }),
        defineField({
          name: 'emailTemplate',
          title: 'Email Template',
          type: 'text',
          description: 'Template for notification emails. Use {field} syntax to include form values.',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'slug.current',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Untitled Form',
        subtitle: subtitle ? `/${subtitle}` : 'No slug',
      }
    },
  },
});

export default formSchema;
