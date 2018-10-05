import { gql } from 'apollo-server-koa';

export default gql`
  type Account {
  id: ID!
  balance: Float!
  availableBalance(context: String): Float!
}

type ReservedBalance {
  id: ID!
  account: Int!
  context: String!
  balance: Float!
}

type VirtualBalance {
  id: ID!
  account: Int!
  context: String!
  balance: Float!
}

type Request {
  id: String!
  result: String!
  error: String!
}

type Query {
  account(id: ID!): Account
  reservedBalance(id: ID!): ReservedBalance
  virtualBalance(id: ID!): VirtualBalance
  reservedBalances(account: ID!): [ReservedBalance]!
  virtualBalances(account: ID!): [VirtualBalance]!
}

type Mutation {
  updateBalance(request: ID!, account: ID!, amount: Float!): Float!
  createReservedBalance(request: ID!, account: ID!, context: String!, amount: Float!): ReservedBalance!
  updateReservedBalance(request: ID!, account: ID!, context: String!, amount: Float!): ReservedBalance!
  releaseReservedBalance(request: ID!, account: ID!, context: String!): Boolean
  createVirtualBalance(request: ID!, account: ID!, context: String!, amount: Float!): VirtualBalance!
  updateVirtualBalance(request: ID!, account: ID!, context: String!, amount: Float!): VirtualBalance!
  cancelVirtualBalance(request: ID!, account: ID!, context: String!): Boolean
  commitVirtualBalance(request: ID!, account: ID!, context: String!): Boolean
}

schema {
  query: Query
  mutation: Mutation
}
`
