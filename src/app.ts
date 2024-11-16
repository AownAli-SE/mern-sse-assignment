import express from "express";
import cors from "cors";
import helmet from "helmet";
// import morgan from "morgan";

const app = express();

app.use(express.json());
// app.use(morgan("common"));

// USE HELMET AND CORS MIDDLEWARES
app.use(
   cors({
      origin: ["*"], // Comma separated list of your urls to access your api. * means allow everything
      credentials: true, // Allow cookies to be sent with requests
   })
);
app.use(
   helmet({
      contentSecurityPolicy: process.env.NODE_ENV === "production" ? undefined : false,
   })
);

export default app;
