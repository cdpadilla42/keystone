import permissionFields from './schema/lists/permissionFields';

// Access control functions
export const userIsAdmin = ({ authentication: { item: user } }) =>
  Boolean(user && user.isAdmin);
export const userOwnsItem = ({ authentication: { item: user } }) => {
  if (!user) {
    return false;
  }

  // Instead of a boolean, you can return a GraphQL query:
  // https://www.keystonejs.com/api/access-control#graphqlwhere
  return { id: user.id };
};

export const userIsAdminOrOwner = (auth) => {
  const isAdmin = access.userIsAdmin(auth);
  const isOwner = access.userOwnsItem(auth);
  return isAdmin ? isAdmin : isOwner;
};

export const isSignedIn = (auth) => !!auth;

export const generatedPermissions = Object.fromEntries(
  Object.keys(permissionFields).map((permission) => [
    permission,
    // TODO Write function that uses session info to answer these questions....
  ])
);
