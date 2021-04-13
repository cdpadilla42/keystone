const permissionFields = require('./schema/lists/permissionFields');
const graphql = String.raw;
// Access control functions
exports.userIsAdmin = ({ authentication: { item: user } }) =>
  Boolean(user && user.isAdmin);
exports.userOwnsItem = ({ authentication: { item: user } }) => {
  if (!user) {
    return false;
  }

  // Instead of a boolean, you can return a GraphQL query:
  // https://www.keystonejs.com/api/access-control#graphqlwhere
  return { id: user.id };
};

exports.userIsAdminOrOwner = (auth) => {
  const isAdmin = exports.userIsAdmin(auth);
  const isOwner = exports.userOwnsItem(auth);
  return isAdmin ? isAdmin : isOwner;
};

exports.isSignedIn = ({ authentication }) => !!authentication.item.id;

// Generated from the permissions fields and based on user's role
const generatedPermissions = Object.fromEntries(
  Object.keys(permissionFields).map((permission) => [
    permission,
    function ({ authentication }) {
      return authentication?.item[permission] || false;
    },
  ])
);

exports.permissions = {
  ...generatedPermissions,
};

const canManageOrders = ({ authentication }) => {
  if (!exports.isSignedIn({ authentication })) return false;
  if (exports.permissions.canManageOrders({ authentication })) return true;
  return false;
};

exports.rules = {
  canManageProducts({ authentication }) {
    if (!exports.isSignedIn({ authentication })) return false;
    // 1. Do they have the permission of canManageProduct
    if (exports.permissions.canManageProducts({ authentication })) return true;
    return false;
  },
  canSeeOtherUsers({ authentication }) {
    if (!exports.isSignedIn({ authentication })) return false;
    if (exports.permissions.canSeeOtherUsers({ authentication })) return true;
    return false;
  },
  canManageUsers({ authentication }) {
    if (!exports.isSignedIn({ authentication })) return false;
    if (exports.permissions.canManageUsers({ authentication })) return true;
    return false;
  },
  canManagePermissions({ authentication }) {
    if (!exports.isSignedIn({ authentication })) return false;
    if (exports.permissions.canManagePermissions({ authentication }))
      return true;
    return false;
  },
  canManageOrders,
  canSeeOrder({ authentication }) {
    if (canManageOrders({ authentication })) return true;
    return false;
  },
};
