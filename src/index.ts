import "./lib/env.config";
import { connectDB } from "./lib/db.config";
import app from "./app";

connectDB();

// Start backend server
const PORT = process.env.PORT || 8500;
app.listen(PORT, () => {
   console.log(`Backend server is running at port ${PORT}`);
});
