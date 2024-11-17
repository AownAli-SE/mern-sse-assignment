import { makeExecutableSchema, mergeSchemas } from "@graphql-tools/schema";

import { typeDefs as authTypeDefs } from "./auth/auth.graphql";
import { resolver as authResolver } from "./auth/auth.resolver";
import { typeDefs as userTypeDefs } from "./users/user.graphql";
import { resolver as userResolver } from "./users/users.resolver";

// Auth schema
const authSchema = makeExecutableSchema({
   typeDefs: authTypeDefs,
   resolvers: authResolver,
});

// User schema
const userSchema = makeExecutableSchema({
   typeDefs: userTypeDefs,
   resolvers: userResolver,
});

// Root schema
export const schema = mergeSchemas({
   schemas: [authSchema, userSchema],
});
