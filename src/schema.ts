import { makeExecutableSchema, mergeSchemas } from "@graphql-tools/schema";

import { typeDefs as authTypeDefs } from "./auth/auth.graphql";
import { resolver as authResolver } from "./auth/auth.resolver";
import { typeDefs as userTypeDefs } from "./users/user.graphql";
import { resolver as userResolver } from "./users/users.resolver";
import { typeDefs as listingTypeDefs } from "./listings/listing.graphql";
import { resolver as listingResolver } from "./listings/listing.resolver";
import { mergeTypeDefs } from "@graphql-tools/merge";

// Merge type definitions
const typeDefs = mergeTypeDefs([authTypeDefs, userTypeDefs, listingTypeDefs]);

// Auth schema
const authSchema = makeExecutableSchema({
   typeDefs: typeDefs,
   resolvers: authResolver,
});

// User schema
const userSchema = makeExecutableSchema({
   typeDefs: typeDefs,
   resolvers: userResolver,
});

// Listing schema
const listingSchema = makeExecutableSchema({
   typeDefs: typeDefs,
   resolvers: listingResolver,
});

// Root schema
export const schema = mergeSchemas({
   schemas: [authSchema, userSchema, listingSchema],
});
