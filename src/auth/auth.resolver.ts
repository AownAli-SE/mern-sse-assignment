import { IncomingHttpHeaders } from "http";
import { LoginDto } from "./dtos/login.dto";
import { SignupDto } from "./dtos/signup.dto";
import { AuthService } from "./auth.service";
import { ContextType } from "../utilities/types/context";
import { throwGraphQLError } from "../utilities/helperMethods";

// Services
const authService = AuthService.getInstance();

// Resolver
export const resolver = {
   Mutation: {
      signup: async (_: undefined, args: SignupDto, ctx: ContextType) => {
         return authService.signup(args, ctx.headers.origin);
      },
      login: (_: undefined, args: LoginDto, ctx: ContextType) => {
         return authService.login(args, ctx.headers.origin);
      },
      switchRole: (_: undefined, __: undefined, ctx: ContextType) => {
         // Checking authentication
         if (!ctx.user) {
            throwGraphQLError("Unauthorized", "UNAUTHORIZED", 401);
         }

         return authService.switchRole(ctx.user, ctx.headers.origin);
      },
   },
};
