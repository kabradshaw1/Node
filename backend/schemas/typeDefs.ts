import { gql }from 'apollo-server-express';

const typeDefs = gql`
  type User {
    _id: ID
    userName: String
    email: String
  }

  type Auth {
    token: ID
    user: User
  }

  type Query {
    user: User
  }

  type Mutation {
    addUser(userName: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    updateUser(userName: String, email: String, password: String): User
  }
`

export default typeDefs
