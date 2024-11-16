import { LoginDto } from "./dtos/login.dto";
import { SignupDto } from "./dtos/signup.dto";

export const resolver = {
   Mutation: {
      signup: (_: never, args: SignupDto) => {
         console.log("args", args);
         return {
            token: "token...",
            role: "role...",
         };
      },
      login: (_: undefined, args: LoginDto) => {
         console.log("args", args);
         return {
            token: "token...",
            role: "role...",
         };
      },
   },
};
