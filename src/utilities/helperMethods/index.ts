import { hash, verify } from "argon2";
import { GraphQLError } from "graphql";

export const hashPassword = async (password: string): Promise<string> => {
   const secret = getBufferedHashSecret();
   return hash(password, {
      secret,
   });
};

export const verifyPassword = async (hashedPassword: string, password: string): Promise<boolean> => {
   const secret = getBufferedHashSecret();
   return verify(hashedPassword, password, {
      secret,
   });
};

export const throwGraphQLError = (message: string, code: string, status: number) => {
   throw new GraphQLError(message, {
      extensions: {
         code,
         http: {
            status,
         },
      },
   });
};

// Private helper methods
const getBufferedHashSecret = () => {
   const secret = process.env.HASH_SECRET;
   if (!secret) {
      throw new Error("HASH_SECRET not defined!");
   }

   return Buffer.from(secret);
};
