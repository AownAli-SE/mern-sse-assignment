export const typeDefs = `#graphql
    type TopUser {
        _id: String!
        firstname: String!
        lastname: String!
        email: String!
        totalOrders: Int!
    }

    type TopListing {
        _id: String!
        title: String!
        totalBookings: Int!
    }

    type Query {
        topRatedSellers: [TopUser!]!
        topRatedListings: [TopListing!]!
        topBuyersWithMostOrders: [TopUser!]!
    }
`;
