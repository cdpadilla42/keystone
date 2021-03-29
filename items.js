const { Keystone } = require('@keystonejs/keystone');
const { Text, Checkbox, Password, Integer } = require('@keystonejs/fields');

module.exports = keystone.createList('Menuitem', {
  fields: {
    name: { type: Text },
    img: { type: Text },
    price: { type: Integer },
    category: { type: Text },
    description: { type: Text },
  },
  // List-level access controls
  access: {
    read: true,
    update: access.userIsAdminOrOwner,
    create: true,
    delete: access.userIsAdmin,
    auth: true,
  },
});
