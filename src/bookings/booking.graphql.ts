export const typeDefs = `#graphql
    type Order {
        _id: String!
        listing: Listing!
        seller: User!
        buyer: User!
        rating: Int
        isCompleted: Boolean!
        status: String!
    }

    type Query {
        sellerOrders: [Order!]!
        buyerOrders: [Order!]!
        order (orderId: String!): Order
    }

    type Mutation {
        createOrder (listingId: String!): Order!
        completeOrder (orderId: String!): Message!
        cancelOrder (orderId: String!): Message!
        rateOrder (orderId: String!, rating: Int!): Message!
    }
`;
