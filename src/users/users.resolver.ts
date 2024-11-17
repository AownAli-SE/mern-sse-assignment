import { throwGraphQLError } from "../utilities/helperMethods";
import { ContextType } from "../utilities/types/context";
import { ChangePasswordDto } from "./dtos/changePassword.dto";
import { UpdateUserDto } from "./dtos/updateUser.dto";
import { UserService } from "./users.service";

const userService = UserService.getInstance();

export const resolver = {
   Query: {
      user: (_: undefined, args: { email: string }, ctx: ContextType) => {
         // Checking Authentication
         if (!ctx.user) {
            throwGraphQLError("Unauthorized", "UNAUTHORIZED", 401);
         }

         return userService.getUserProfile(args.email);
      },
   },

   Mutation: {
      updateUser: (_: undefined, args: UpdateUserDto, ctx: ContextType) => {
         // Checking Authentication
         if (!ctx.user) {
            throwGraphQLError("Unauthorized", "UNAUTHORIZED", 401);
         }

         return userService.updateUser(args.email, args);
      },
      deleteUser: (_: undefined, args: { email: string }, ctx: ContextType) => {
         // Checking Authentication
         if (!ctx.user) {
            throwGraphQLError("Unauthorized", "UNAUTHORIZED", 401);
         }

         return userService.deleteUser(args.email);
      },
      changePassword: (_: undefined, args: ChangePasswordDto, ctx: ContextType) => {
         // Checking Authentication
         if (!ctx.user) {
            throwGraphQLError("Unauthorized", "UNAUTHORIZED", 401);
         }

         return userService.changePassword("", args.oldPassword, args.newPassword);
      },
   },
};
