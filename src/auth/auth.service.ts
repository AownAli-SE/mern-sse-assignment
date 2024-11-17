import { JwtService } from "./jwt.service";
import User from "../users/user.schema";
import { SignupDto } from "./dtos/signup.dto";
import { UserService } from "../users/users.service";
import { LoginDto } from "./dtos/login.dto";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import { ContextUser } from "../utilities/types/context";
import { throwGraphQLError, verifyPassword } from "../utilities/helperMethods";

export class AuthService {
   private jwtService = JwtService.getInstance();
   private userService = UserService.getInstance();

   async signup(signupDto: SignupDto, audience: string) {
      // Saving user record to database
      const user = await User.create(signupDto.body);

      // Creating JWT token
      const token = this.jwtService.getToken(audience, user._id.toString(), user.email, user.isAdmin, "buyer");
      return {
         token,
         role: "buyer",
      };
   }

   async login(loginDto: LoginDto, audience: string) {
      const { email, password } = loginDto.body;

      // Get user by email
      const user = await this.userService.getUser(email);
      if (!user) {
         throwGraphQLError("Email or password incorrect!", ApolloServerErrorCode.BAD_USER_INPUT, 400);
      }

      // Verify password
      const doesMatch = await verifyPassword(user.password, password);
      if (!doesMatch) {
         throwGraphQLError("Email or password incorrect!", ApolloServerErrorCode.BAD_USER_INPUT, 400);
      }

      // Generate JWT token
      const token = this.jwtService.getToken(audience, user._id.toString(), email, user.isAdmin, "buyer");

      return {
         token,
         role: "buyer",
      };
   }

   switchRole(user: ContextUser, audience: string) {
      const role = user.role === "buyer" ? "seller" : "buyer";
      const newToken = this.jwtService.getToken(audience, user.id, user.email, user.isAdmin, role);
      return { token: newToken, role };
   }

   //////////////////////
   /// Singleton pattern
   //////////////////////
   private static _instance: AuthService | null = null;
   private constructor() {}

   static getInstance() {
      if (!AuthService._instance) {
         AuthService._instance = new AuthService();
      }

      return AuthService._instance;
   }
}
