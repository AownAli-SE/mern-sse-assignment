import "./lib/env.config";

import http from "http";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";

import app from "./app";
import { connectDB } from "./lib/db.config";
import { schema } from "./schema";

// Connecting to database
connectDB();

// Setting up HTTP and Apollo Server
const httpServer = http.createServer(app);
const server = new ApolloServer({
   schema: schema,
   includeStacktraceInErrorResponses: false,
   plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Starting up Apollo servers
server.start().then(async () => {
   // Binding express middlewares to Apollo Server
   app.use(
      "/graphql",
      expressMiddleware(server, {
         context: async (ctx) => ctx.req.headers,
      })
   );

   // Starting up HTTP Server
   const port = process.env.PORT ? parseInt(process.env.PORT) : 8000;
   await new Promise((resolve: any) => httpServer.listen({ port }, resolve));
   console.log(`🚀 Server ready`);
});
