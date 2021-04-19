const { Text, Relationship, Password } = require('@keystonejs/fields');
const { rules } = require('../../access');
const permissionFields = require('./permissionFields');

const generatedPermissionsFields = {};

Object.keys(permissionFields).forEach((key) => {
  generatedPermissionsFields[key] = {
    ...permissionFields[key],
    access: rules.canManagePermissions,
  };
});

module.exports = [
  'User',
  {
    fields: {
      name: { type: Text },
      email: {
        type: Text,
        isUnique: true,
      },
      assignedTo: {
        type: Relationship,
        ref: 'Role',
      },
      password: {
        type: Password,
      },
      orders: {
        type: Relationship,
        ref: 'Order.user',
        many: true,
      },
      ...generatedPermissionsFields,
    },
    // List-level access controls
    access: {
      read: rules.canSeeOtherUsers,
      update: rules.canManageUsers,
      create: rules.canManageUsers,
      delete: rules.canManageUsers,
      auth: true,
    },
  },
];
