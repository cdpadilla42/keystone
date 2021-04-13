const { Text, Checkbox, Relationship } = require('@keystonejs/fields');
const { rules } = require('../../access');

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
      update: rules.canManageProducts,
      create: rules.canManageProducts,
      delete: rules.canManageProducts,
    },
  },
];
