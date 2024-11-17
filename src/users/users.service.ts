import { UpdateUserDto } from "./dtos/updateUser.dto";
import User from "./user.schema";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import { hashPassword, throwGraphQLError, verifyPassword } from "../utilities/helperMethods";

export class UserService {
   async getUser(email: string) {
      return await User.findOne({ email });
   }

   async getUserById(id: string) {
      return await User.findById(id);
   }

   async getUserProfile(email: string) {
      const user = await User.findOne({ email });
      if (!user) {
         throwGraphQLError(`User with email ${email} doesn't exist!`, ApolloServerErrorCode.BAD_USER_INPUT, 400);
      }

      return user;
   }

   async updateUser(email: string, updateUserDto: UpdateUserDto) {
      const user = await User.findOne({ email });
      if (!user) {
         throwGraphQLError(`User with email ${email} doesn't exist!`, ApolloServerErrorCode.BAD_USER_INPUT, 400);
      }

      user.firstname = updateUserDto.body.firstname;
      user.lastname = updateUserDto.body.lastname;
      user.username = updateUserDto.body.username;

      await user.save();
      return user;
   }

   async deleteUser(email: string) {
      const deletedRecord = await User.deleteOne({ email });
      if (deletedRecord.deletedCount === 0) {
         throwGraphQLError(`User with email ${email} doesn't exist!`, ApolloServerErrorCode.BAD_USER_INPUT, 400);
      }

      return { message: "User account deleted!" };
   }

   async changePassword(email: string, oldPassword: string, newPassword: string) {
      // Get user by email
      const user = await User.findOne({ email });
      if (!user) {
         throwGraphQLError(`User with email ${email} doesn't exist!`, ApolloServerErrorCode.BAD_USER_INPUT, 400);
      }

      // Verify password
      const doesMatch = await verifyPassword(user.password, oldPassword);
      if (!doesMatch) {
         throwGraphQLError(`Old password is incorrect`, ApolloServerErrorCode.BAD_USER_INPUT, 400);
      }

      // Hash new password and save user record
      user.password = await hashPassword(newPassword);
      await user.save();

      return { message: "Password changed successfully!" };
   }

   //////////////////////
   /// Singleton pattern
   //////////////////////
   private static _instance: UserService | null = null;
   private constructor() {}

   static getInstance() {
      if (!UserService._instance) {
         UserService._instance = new UserService();
      }

      return UserService._instance;
   }
}
