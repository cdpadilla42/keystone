const { Text, Checkbox, Relationship } = require('@keystonejs/fields');

module.exports = [
  'Customization',
  {
    fields: {
      name: { type: Text },
      title: { type: Text },
      required: { type: Checkbox },
      selectMultiple: { type: Checkbox },
      options: { type: Relationship, ref: 'Option', many: true },
    },
    // List-level access controls
    access: {
      read: true,
      update: true,
      create: true,
      delete: true,
      auth: true,
    },
  },
];
