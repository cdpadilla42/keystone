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

exports.isSignedIn = (auth) => !!auth;

// Generated from the permissions fields and based on user's role
const generatedPermissions = Object.fromEntries(
  Object.keys(permissionFields).map((permission) => [
    permission,
    function ({ authentication }) {
      console.log(authentication);
      console.log(authentication?.item);
      console.log(authentication?.item);
      // TODO Convert me to graphql like the above since assignedTo is a ref
      return authentication?.item[permission] || false;
    },
  ])
);

exports.permissions = {
  ...generatedPermissions,
};
