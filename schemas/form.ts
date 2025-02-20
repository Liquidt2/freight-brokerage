import { defineField, defineType } from 'sanity';

// Form field type definition
const formField = defineType({
  name: 'formField',
  title: 'Form Field',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: Rule => Rule.required().min(2),
    }),
    defineField({
      name: 'name',
      title: 'Field Name',
      type: 'string',
      validation: Rule => Rule.required(),
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
          { title: 'Number', value: 'number' },
          { title: 'State', value: 'state' },
          { title: 'Truck & Trailer Type', value: 'truckTrailerType' },
          { title: 'ZIP Code', value: 'zipCode' },
          { title: 'Conditional', value: 'conditional' },
        ],
      },
      validation: Rule => Rule.required(),
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
          defineField({
            name: 'value',
            type: 'string',
            title: 'Option Value'
          })
        ],
      }],
      hidden: ({ parent }) => !['select', 'radio', 'state'].includes(parent?.type || ''),
    }),
    defineField({
      name: 'validation',
      title: 'Validation',
      type: 'object',
      fields: [
        defineField({
          name: 'min',
          title: 'Minimum Value',
          type: 'number',
        }),
        defineField({
          name: 'max',
          title: 'Maximum Value',
          type: 'number',
        }),
        defineField({
          name: 'pattern',
          title: 'Pattern',
          type: 'string',
          description: 'Regular expression pattern for validation',
        }),
        defineField({
          name: 'message',
          title: 'Error Message',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'unit',
      title: 'Unit',
      type: 'string',
      description: 'Unit of measurement (e.g., lbs, ft, °F)',
      hidden: ({ parent }) => !['number'].includes(parent?.type || ''),
    }),
  ],
});

// Compliance field type definition
const complianceField = defineType({
  name: 'complianceField',
  title: 'Compliance Field',
  type: 'document',
  fields: [
    defineField({
      name: 'text',
      title: 'Consent Text',
      type: 'string',
      validation: Rule => Rule.required(),
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
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'required',
      title: 'Required',
      type: 'boolean',
      initialValue: true,
    }),
  ],
});

// Form schema
const formSchema = defineType({
  name: 'form',
  title: 'Forms',
  type: 'document',
  fields: [
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
          { title: 'Archived', value: 'archived' }
        ],
      },
      initialValue: 'draft',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Form Name',
      type: 'string',
      validation: Rule => Rule.required().min(3),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 100 },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Form Title',
      type: 'string',
      validation: Rule => Rule.required(),
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
      of: [{
        type: 'object',
        name: 'field',
        fields: [
          defineField({
            name: 'label',
            title: 'Label',
            type: 'string',
            validation: Rule => Rule.required(),
          }),
          defineField({
            name: 'name',
            title: 'Field Name',
            type: 'string',
            validation: Rule => Rule.required(),
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
                { title: 'Number', value: 'number' },
                { title: 'State', value: 'state' },
                { title: 'Truck & Trailer Type', value: 'truckTrailerType' },
                { title: 'ZIP Code', value: 'zipCode' },
              ],
            },
            validation: Rule => Rule.required(),
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
                defineField({
                  name: 'value',
                  type: 'string',
                  title: 'Option Value'
                })
              ],
            }],
            hidden: ({ parent }) => !['select', 'radio', 'state', 'truckTrailerType'].includes(parent?.type || ''),
          }),
        ],
      }],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'complianceFields',
      title: 'Compliance Fields',
      type: 'array',
      of: [{
        type: 'object',
        name: 'complianceField',
        fields: [
          defineField({
            name: 'text',
            title: 'Consent Text',
            type: 'string',
            validation: Rule => Rule.required(),
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
            validation: Rule => Rule.required(),
          }),
          defineField({
            name: 'required',
            title: 'Required',
            type: 'boolean',
            initialValue: true,
          }),
        ],
      }],
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
          type: 'object',
          fields: [
            defineField({
              name: 'subject',
              title: 'Email Subject',
              type: 'string',
              description: 'Use {fieldName} syntax for dynamic values (e.g., "New Quote Request from {companyName}")',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'sections',
              title: 'Email Sections',
              type: 'array',
              of: [{
                type: 'object',
                fields: [
                  defineField({
                    name: 'title',
                    title: 'Section Title',
                    type: 'string',
                    validation: Rule => Rule.required(),
                  }),
                  defineField({
                    name: 'fields',
                    title: 'Fields',
                    type: 'array',
                    of: [{
                      type: 'object',
                      fields: [
                        defineField({
                          name: 'label',
                          title: 'Label',
                          type: 'string',
                          validation: Rule => Rule.required(),
                        }),
                        defineField({
                          name: 'value',
                          title: 'Value',
                          type: 'string',
                          description: 'Use {fieldName} to display form field values',
                          validation: Rule => Rule.required(),
                        }),
                      ],
                    }],
                    validation: Rule => Rule.required(),
                  }),
                ],
              }],
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'footer',
              title: 'Email Footer',
              type: 'text',
              description: 'Optional footer text for the email',
            }),
          ],
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
export { formField, complianceField };
