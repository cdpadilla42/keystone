const { Keystone } = require('@keystonejs/keystone');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const {
  Text,
  Checkbox,
  Password,
  Integer,
  Relationship,
  Virtual,
  Select,
} = require('@keystonejs/fields');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const initialiseData = require('./initial-data');

const { MongooseAdapter: Adapter } = require('@keystonejs/adapter-mongoose');
const { types, queries } = require('./Schema');
const mutations = require('./Resolvers/mutations');
const PROJECT_NAME = 'apollo-next-backend';
require('dotenv').config();

const adapterConfig = { mongoUri: process.env.TACO_DATABASE_URL };

const keystone = new Keystone({
  adapter: new Adapter(adapterConfig),
  onConnect: process.env.CREATE_TABLES !== 'true' && initialiseData,
});

// Access control functions
const userIsAdmin = ({ authentication: { item: user } }) =>
  Boolean(user && user.isAdmin);
const userOwnsItem = ({ authentication: { item: user } }) => {
  if (!user) {
    return false;
  }

  // Instead of a boolean, you can return a GraphQL query:
  // https://www.keystonejs.com/api/access-control#graphqlwhere
  return { id: user.id };
};

const userIsAdminOrOwner = (auth) => {
  const isAdmin = access.userIsAdmin(auth);
  const isOwner = access.userOwnsItem(auth);
  return isAdmin ? isAdmin : isOwner;
};

const access = { userIsAdmin, userOwnsItem, userIsAdminOrOwner };

const schemas = require('./schema/index');

schemas.forEach((schema) => {
  keystone.createList(...schema);
});

keystone.createList('User', {
  fields: {
    name: { type: Text },
    email: {
      type: Text,
      isUnique: true,
    },
    isAdmin: {
      type: Checkbox,
      // Field-level access controls
      // Here, we set more restrictive field access so a non-admin cannot make themselves admin.
      access: {
        update: access.userIsAdmin,
      },
    },
    password: {
      type: Password,
    },
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

const Item = keystone.createList('Item', {
  fields: {
    name: { type: Text },
    img: { type: Text },
    price: { type: Integer },
    category: { type: Text },
    description: { type: Text },
    customizations: {
      type: Relationship,
      ref: 'Customization',
      many: true,
    },
  },
  // List-level access controls
  access: {
    read: true,
    update: true,
    create: true,
    delete: access.userIsAdmin,
    auth: true,
  },
});

keystone.createList('Customization', {
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
    delete: access.userIsAdmin,
    auth: true,
  },
});

keystone.createList('Option', {
  fields: {
    name: { type: Text, required: true },
    price: { type: Integer },
  },
  // List-level access controls
  access: {
    read: true,
    update: true,
    create: true,
    delete: access.userIsAdmin,
    auth: true,
  },
});

keystone.extendGraphQLSchema({
  types: [
    {
      type: types,
    },
  ],
  queries: queries,
  mutations,
});

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User',
  config: { protectIdentities: process.env.NODE_ENV === 'production' },
});

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({
      name: PROJECT_NAME,
      enableDefaultRoute: true,
      // authStrategy,
    }),
  ],
};
