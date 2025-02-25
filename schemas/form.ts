import { defineField, defineType } from 'sanity';

// Email field type definition
const emailField = defineType({
  name: 'emailField',
  title: 'Email Field',
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
      description: 'Use {fieldName} for values, {#if fieldName==="value"}...{/if} for conditions',
      validation: Rule => Rule.required(),
    }),
  ],
});

// Email section type definition
const emailSection = defineType({
  name: 'emailSection',
  title: 'Email Section',
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
      of: [{ type: 'emailField' }],
      validation: Rule => Rule.required(),
    }),
  ],
});

// Form field type definition
const formField = defineType({
  name: 'formField',
  title: 'Form Field',
  type: 'object',
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
          // Basic field types
          { title: '-- Basic Fields --', value: '_basic_header' },
          { title: 'Text', value: 'text' },
          { title: 'Email', value: 'email' },
          { title: 'Phone', value: 'tel' },
          { title: 'Textarea', value: 'textarea' },
          { title: 'Select', value: 'select' },
          { title: 'Radio', value: 'radio' },
          { title: 'Date', value: 'date' },
          { title: 'Number', value: 'number' },
          { title: 'State', value: 'state' },
          { title: 'ZIP Code', value: 'zipCode' },
          
          // Load details
          { title: '-- Load Details --', value: '_load_header' },
          { title: 'Trailer Type', value: 'trailerType' },
          { title: 'Weight', value: 'weight' },
          { title: 'Commodity', value: 'commodity' },
          
          // Hazmat fields
          { title: '-- Hazmat Information --', value: '_hazmat_header' },
          { title: 'Hazmat Load', value: 'isHazmat' },
          { title: 'UN Number', value: 'unNumber' },
          { title: 'Hazmat Class', value: 'hazmatClass' },
          
          // Temperature control
          { title: '-- Temperature Control --', value: '_temp_header' },
          { title: 'Temperature Controlled', value: 'isTemperatureControlled' },
          { title: 'Temperature', value: 'temperature' },
          
          // Pallet information
          { title: '-- Pallet Information --', value: '_pallet_header' },
          { title: 'Palletized', value: 'isPalletized' },
          { title: 'Pallet Count', value: 'palletCount' },
          
          // Heavy haul
          { title: '-- Heavy Load --', value: '_heavy_header' },
          { title: 'Heavy Load', value: 'isHeavyLoad' },
          { title: 'Heavy Load Weight', value: 'heavyLoadWeight' },
          
          // Oversized load
          { title: '-- Oversized Load --', value: '_oversized_header' },
          { title: 'Oversized Load', value: 'isOversizedLoad' },
          { title: 'Dimensions', value: 'dimensions' },
          
          // High value
          { title: '-- High Value --', value: '_value_header' },
          { title: 'High Value Load', value: 'isHighValue' },
          { title: 'Insurance Info', value: 'insuranceInfo' }
        ]
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
      hidden: ({ parent }) => !['select', 'radio', 'state'].includes(parent?.type || '') && !parent?.type?.startsWith('is'),
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
      name: 'hidden',
      title: 'Hidden',
      type: 'boolean',
      description: 'Hide this field by default',
      initialValue: false,
    }),
    defineField({
      name: 'showWhen',
      title: 'Show When',
      type: 'object',
      description: 'Configure when this field should be shown',
      fields: [
        defineField({
          name: 'field',
          title: 'Parent Field',
          type: 'string',
          description: 'Field that controls visibility',
          options: {
            list: [
              { title: 'Hazmat Load', value: 'isHazmat' },
              { title: 'Temperature Controlled', value: 'isTemperatureControlled' },
              { title: 'Palletized', value: 'isPalletized' },
              { title: 'Heavy Load', value: 'isHeavyLoad' },
              { title: 'Oversized Load', value: 'isOversizedLoad' },
              { title: 'High Value Load', value: 'isHighValue' }
            ]
          }
        }),
        defineField({
          name: 'equals',
          title: 'Parent Value',
          type: 'string',
          description: 'Show when parent field equals this value',
          options: {
            list: [
              { title: 'Yes', value: 'Yes' },
              { title: 'No', value: 'No' }
            ]
          }
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
  type: 'object',
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
          { title: 'SMS Updates', value: 'sms' },
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
      of: [
        // Support for the new grouped fields structure
        {
          type: 'object',
          name: 'fieldGroup',
          title: 'Field Group',
          fields: [
            defineField({
              name: 'group',
              title: 'Group Name',
              type: 'string',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'fields',
              title: 'Fields',
              type: 'array',
              of: [{ type: 'formField' }],
              validation: Rule => Rule.required(),
            }),
          ],
        },
        // Maintain backward compatibility with direct form fields
        { type: 'formField' }
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'complianceFields',
      title: 'Compliance Fields',
      type: 'array',
      of: [{ type: 'complianceField' }],
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
          of: [{ type: 'emailSection' }],
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
export { formField, complianceField, emailField, emailSection };
