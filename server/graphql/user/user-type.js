const gql = require("graphql-tag");

const typeDefsUser = gql`
  type UserType {
    id: ID!
    username: String!
    email: String!
    firstName: String
    lastName: String
    password: String!
    favoriteRestaurants: [RestaurantType]!
    token: String
  }

  input UserInput {
    username: String!
    email: String!
    firstName: String
    lastName: String
    password: String!
    favoriteRestaurants: [ID!]
  }

  input LoginUserInput {
    email: String!
    password: String!
  }

  input UpdateUserInput {
    username: String
    email: String
    firstName: String
    lastName: String
    password: String
    favoriteRestaurants: [ID!]
  }

  type Query {
    user(id: ID!): UserType
    users: [UserType]
  }

  type Mutation {
    createUser(input: UserInput!): UserType
    updateUser(id: ID!, input: UpdateUserInput!): UserType
    deleteUser(id: ID!): UserType
    loginUser(input: LoginUserInput): UserType
  }
`;

module.exports = typeDefsUser;
