import User from "./user.schema";

export class UserService {
   getUser(email: string) {
      return User.findOne({ email });
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
