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
const { types } = require('./schema/customTypes/Schema');
const mutations = require('./Resolvers/mutations');
const PROJECT_NAME = 'apollo-next-backend';
require('dotenv').config();

const adapterConfig = { mongoUri: process.env.TACO_DATABASE_URL };

const keystone = new Keystone({
  adapter: new Adapter(adapterConfig),
  onConnect: process.env.CREATE_TABLES !== 'true' && initialiseData,
});

const access = require('./access');

const listSchemas = require('./schema/lists/index');

listSchemas.forEach((schema) => {
  keystone.createList(...schema);
});

keystone.createList('User', {
  fields: {
    name: { type: Text },
    email: {
      type: Text,
      isUnique: true,
    },
    assignedTo: {
      type: Relationship,
      ref: 'Role',
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
