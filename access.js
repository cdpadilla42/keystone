const permissionFields = require('./schema/lists/permissionFields');

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
  const isAdmin = access.userIsAdmin(auth);
  const isOwner = access.userOwnsItem(auth);
  return isAdmin ? isAdmin : isOwner;
};

exports.isSignedIn = (auth) => !!auth;

exports.generatedPermissions = Object.fromEntries(
  Object.keys(permissionFields).map((permission) => [
    permission,
    // TODO Write function that uses session info to answer these questions....
  ])
);
