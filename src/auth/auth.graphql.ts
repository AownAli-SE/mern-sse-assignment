export const typeDefs = `#graphql
    type Query {
        auth: String
    }

   type Auth {
      token: String!
      role: String!
   }
   
   type Mutation {
      signup (body: SignupInput): Auth!
      login (body: LoginInput): Auth!
   }

   input SignupInput {
      firstname: String!
      lastname: String!
      username: String!
      email: String!
      password: String!
   }

   input LoginInput {
      email: String!
      password: String!
   }
`;
