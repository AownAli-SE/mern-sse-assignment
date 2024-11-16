import { makeExecutableSchema } from "@graphql-tools/schema";

import { typeDefs as authTypeDefs } from "./auth/auth.graphql";
import { resolver as authResolver } from "./auth/auth.resolver";

// Auth schema
export const schema = makeExecutableSchema({
   typeDefs: authTypeDefs,
   resolvers: authResolver,
});
