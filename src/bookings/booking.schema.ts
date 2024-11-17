import { Document, model, Schema } from "mongoose";

interface IBooking extends Document {
   listing: Schema.Types.ObjectId;
   seller: Schema.Types.ObjectId;
   buyer: Schema.Types.ObjectId;
   isCompleted: boolean;
   rating: number;
   status: "In progress" | "Completed" | "Cancelled";
}

const schema = new Schema<IBooking>({
   listing: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
   },
   isCompleted: {
      type: Boolean,
      default: false,
   },
   seller: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
   },
   buyer: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
   },
   rating: {
      type: Number,
      default: null,
      min: 0,
      max: 5,
   },
   status: {
      type: String,
      enum: ["In progress", "Completed", "Cancelled"],
      default: "In progress",
   },
});

export default model("Booking", schema);
