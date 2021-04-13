const { Checkbox } = require('@keystonejs/fields');
const access = require('../../access');

module.exports = {
  isAdmin: { type: Checkbox },
  canManageProducts: { type: Checkbox },
  canSeeOtherUsers: { type: Checkbox },
  canManageUsers: { type: Checkbox },
  canManageRoles: { type: Checkbox },
  canManageRoles: { type: Checkbox },
  canManageOrders: { type: Checkbox },
};
