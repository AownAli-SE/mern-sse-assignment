import { IncomingHttpHeaders } from "http";
import { LoginDto } from "./dtos/login.dto";
import { SignupDto } from "./dtos/signup.dto";
import { AuthService } from "./auth.service";

// Services
const authService = AuthService.getInstance();

// Resolver
export const resolver = {
   Query: {
      switchRole: (_: undefined, __: undefined, headers: IncomingHttpHeaders) => {
         return authService.switchRole(headers.authorization, headers.origin);
      },
   },
   Mutation: {
      signup: async (_: undefined, args: SignupDto, headers: IncomingHttpHeaders) => {
         return authService.signup(args, headers.origin);
      },
      login: (_: undefined, args: LoginDto, headers: IncomingHttpHeaders) => {
         return authService.login(args, headers.origin);
      },
   },
};
