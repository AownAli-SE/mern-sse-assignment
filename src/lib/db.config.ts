import { connect } from "mongoose";

const connectionString = process.env.MONGODB_URL;
if (!connectionString) throw new Error("MONGO_URI environment variable is not defined");

export const connectDB = async () => {
   try {
      await connect(connectionString);
      console.log("Database connected!");
   } catch (err) {
      console.log(err);
   }
};
