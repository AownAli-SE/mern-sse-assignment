import { makeExecutableSchema, mergeSchemas } from "@graphql-tools/schema";
import { mergeTypeDefs } from "@graphql-tools/merge";

import { typeDefs as authTypeDefs } from "./auth/auth.graphql";
import { resolver as authResolver } from "./auth/auth.resolver";
import { typeDefs as userTypeDefs } from "./users/user.graphql";
import { resolver as userResolver } from "./users/users.resolver";
import { typeDefs as listingTypeDefs } from "./listings/listing.graphql";
import { resolver as listingResolver } from "./listings/listing.resolver";
import { typeDefs as bookingTypeDefs } from "./bookings/booking.graphql";
import { resolver as bookingResolver } from "./bookings/booking.resolver";
import { typeDefs as adminTypeDefs } from "./admin/admin.graphql";
import { resolver as adminResolver } from "./admin/admin.resolver";

// Merge type definitions
const typeDefs = mergeTypeDefs([authTypeDefs, userTypeDefs, listingTypeDefs, bookingTypeDefs, adminTypeDefs]);

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

// Booking schema
const bookingSchema = makeExecutableSchema({
   typeDefs: typeDefs,
   resolvers: bookingResolver,
});

// Admin schema
const adminSchema = makeExecutableSchema({
   typeDefs: typeDefs,
   resolvers: adminResolver,
});

// Root schema
export const schema = mergeSchemas({
   schemas: [authSchema, userSchema, listingSchema, bookingSchema, adminSchema],
});
