export const typeDefs = `#graphql
    type Listing {
        _id: String!
        title: String!
        description: String
        seller: User!
        createdAt: String!
        updatedAt: String!
    }

    type Query {
        listings: [Listing!]!
        listing (id: String!): Listing
    }

    type Mutation {
        addListing (body: AddListingInput!): Listing!
        updateListing (id: String, body: UpdateListingInput!): Listing
        deleteListing (id: String): Message
    }

    input AddListingInput {
        title: String!
        description: String!
    }

    input UpdateListingInput {
        title: String
        description: String
    }
`;
