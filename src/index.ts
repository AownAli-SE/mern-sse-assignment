import "./lib/env.config";

import http from "http";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";

import app from "./app";
import { connectDB } from "./lib/db.config";
import { schema } from "./schema";
import { JwtService } from "./auth/jwt.service";
import { JwtPayload } from "jsonwebtoken";

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
         context: async (ctx) => {
            // Parsing user info from JWT token
            const headers = ctx.req.headers;
            const jwtService = JwtService.getInstance();

            const bearerToken = headers.authorization;
            if (!bearerToken) {
               return { user: null, headers };
            }

            const tokenArray = bearerToken.split(" ");
            if (tokenArray[0].toLocaleLowerCase() !== "bearer") {
               return { user: null, headers };
            }

            const token = tokenArray[1];
            const payload = jwtService.verifyToken(token, headers.origin) as JwtPayload;
            const user = payload ? { id: payload.id, email: payload.email, role: payload.role } : null;

            return { user, headers };
         },
      })
   );

   // Starting up HTTP Server
   const port = process.env.PORT ? parseInt(process.env.PORT) : 8000;
   await new Promise((resolve: any) => httpServer.listen({ port }, resolve));
   console.log(`🚀 Server ready`);
});
