// Import necessary modules
import mongoose, { Schema, Document } from "mongoose";
import { hash } from "argon2";

// Define the interface for User document
export interface IUser extends Document {
   firstname: string;
   lastname: string;
   email: string;
   username: string;
   password: string;
   isAdmin: boolean;
   createdAt: Date;
   updatedAt: Date;
}

// Create a schema for the User model
const userSchema: Schema<IUser> = new Schema(
   {
      firstname: {
         type: String,
         required: true,
         trime: true,
         match: [/^[A-Za-z\s]+$/, "Only alphabets are allowed"],
         minLength: [2, "Firstname must have atleast 2 characters"],
         maxLength: [30, "Firstname can have atmost 20 characters"],
      },
      lastname: {
         type: String,
         required: true,
         trim: true,
         match: [/^[A-Za-z\s]+$/, "Only alphabets are allowed"],
         minLength: [2, "Lastname must have atleast 2 characters"],
         maxLength: [30, "Lastname can have atmost 20 characters"],
      },
      email: {
         type: String,
         required: true,
         unique: true,
         trim: true,
         match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Email is not valid"],
      },
      username: {
         type: String,
         required: true,
         unique: true,
         match: [/^[a-zA-Z0-9]+$/, "Username can contain only numbers and alphabets"],
      },
      password: {
         type: String,
         required: true,
         trim: true,
         minlength: [6, "Password must be atleast 6 characters"],
         match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_-]).{6,}$/,
            "Password is not strong enough. (1 Uppercase, 1 Lowercase, 1 Special Character (from upper numeric keys), 1 Numeric Value)",
         ],
      },
      isAdmin: { type: Boolean, default: false },
   },
   { timestamps: true }
);

// Hashing password before saving document
userSchema.pre("save", async function (next) {
   // Skip hashing in case of document updating
   if (!this.isNew) next();

   const secret = process.env.HASH_SECRET;
   if (!secret) throw new Error("HASH_SECRET not defined");

   const hashedPassword = await hash(this.password, {
      secret: Buffer.from(secret, "utf8"),
   });

   this.password = hashedPassword;

   next();
});

// Create and export the User model
export default mongoose.model<IUser>("User", userSchema);
