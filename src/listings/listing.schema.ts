// Import necessary modules
import mongoose, { Schema, Document } from "mongoose";

// Define the interface for Listing document
export interface IListing extends Document {
   title: string;
   description: string;
   seller: Schema.Types.ObjectId;
   createdAt: Date;
   updatedAt: Date;
}

// Create a schema for the Listing model
const listingSchema: Schema<IListing> = new Schema(
   {
      title: {
         type: String,
         required: true,
         trim: true,
         minlength: [10, "Title must have atleast 10 characters"],
         maxlength: [60, "Title can have atmost 60 characters"],
         match: [/^[A-Za-z\s]+$/, "Only alphabets are allowed"],
      },
      description: {
         type: String,
         trim: true,
         maxlength: [2000, "Title can have atmost 60 characters"],
      },
      seller: {
         type: Schema.Types.ObjectId,
         ref: "User",
         required: [true, "Seller is required"],
      },
   },
   { timestamps: true }
);

// Create and export the Listing model
export default mongoose.model<IListing>("Listing", listingSchema);
