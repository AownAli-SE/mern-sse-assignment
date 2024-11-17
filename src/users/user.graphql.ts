export const typeDefs = `#graphql
    type User {
        _id: String!
        firstname: String!
        lastname: String!
        username: String!
        email: String!
        created_at: String!
        updated_at: String!
    }

    type Message {
        message: String!
    }

    type Query {
        user (email: String): User!
    }

    type Mutation {
        updateUser (email: String, body: UpdateUserInput): User!
        deleteUser (email: String): Message!
        changePassword (oldPassword: String, newPassword: String): Message!
    }

    input UpdateUserInput {
        firstname: String
        lastname: String
        username: String
    }
`;
