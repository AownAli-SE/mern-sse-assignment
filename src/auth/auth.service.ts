import { GraphQLError } from "graphql";
import { verify } from "argon2";

import { JwtService } from "./jwt.service";
import User from "../users/user.schema";
import { SignupDto } from "./dtos/signup.dto";
import { UserService } from "../users/users.service";
import { LoginDto } from "./dtos/login.dto";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import { JwtPayload } from "jsonwebtoken";

export class AuthService {
   private jwtService = JwtService.getInstance();
   private userService = UserService.getInstance();

   async signup(signupDto: SignupDto, audience: string) {
      // Saving user record to database
      const user = await User.create(signupDto.body);

      // Creating JWT token
      const token = this.jwtService.getToken(audience, user._id.toString(), user.email, "buyer");
      return {
         token,
         role: "buyer",
      };
   }

   async login(loginDto: LoginDto, audience: string) {
      const { email, password } = loginDto.body;

      // Get user by email
      const user = await this.userService.getUser(email);
      if (!user)
         throw new GraphQLError("Email or password incorrect!", {
            extensions: {
               code: "BAD_REQUEST",
               http: {
                  status: 400,
               },
            },
         });

      // Verify password
      const secret = process.env.HASH_SECRET;
      if (!secret) throw new Error("HASH_SECRET not defined");

      const doesMatch = await verify(user.password, password, {
         secret: Buffer.from(secret, "utf8"),
      });

      if (!doesMatch)
         throw new GraphQLError("Email or password incorrect!", {
            extensions: {
               code: ApolloServerErrorCode.BAD_USER_INPUT,
               http: {
                  status: 400,
               },
            },
         });

      // Generate JWT token
      const token = this.jwtService.getToken(audience, user._id.toString(), email, "buyer");

      return {
         token,
         role: "buyer",
      };
   }

   switchRole(bearerToken: string, audience: string) {
      const token = bearerToken?.split(" ")?.at(1);
      if (!token)
         throw new GraphQLError("Unauthorized", {
            extensions: {
               code: "UNAUTHORIZED",
               http: {
                  status: 401,
               },
            },
         });

      const payload = this.jwtService.verifyToken(token, audience) as JwtPayload;
      const role = payload.role === "buyer" ? "seller" : "buyer";

      const newToken = this.jwtService.getToken(audience, payload.id, payload.email, role);

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
