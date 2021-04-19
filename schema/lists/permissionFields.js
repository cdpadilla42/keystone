const { Checkbox } = require('@keystonejs/fields');
const access = require('../../access');

module.exports = {
  canManageProducts: { type: Checkbox },
  canSeeOtherUsers: { type: Checkbox },
  canManageUsers: { type: Checkbox },
  canManagePermissions: { type: Checkbox },
  canManageOrders: { type: Checkbox },
};
