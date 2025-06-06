import express from "express";
import { ENV_VARS } from "./config/envVars.js";
import dbconnect from "./config/mongodb.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import searchRouter from "./routes/searchRoutes.js";
import movieRouter from "./routes/movieRoutes.js";
import watchRouter from "./routes/watchlistRoutes.js";

const App = express();

App.use(express.json());
App.use(cookieParser());

App.use(
  cors({
    origin: "http://localhost:5173", // don't use '*'
    credentials: true, // allow cookies, sessions, etc.
  })
);

const PORT = ENV_VARS.PORT;

try {
  App.get("/test", (req, res) => {
    res.send("WORKING");
  });

  App.use("/api/v1/auth", authRouter);
  App.use("/api/v1/movie", movieRouter);
  App.use("/api/v1/search", searchRouter);
  App.use("/api/v1/watchlist", watchRouter);

  App.listen(PORT, () => {
    console.log(`STARTING ENTERTAINMENT ENGINE AT PORT, ${PORT}............`);
    dbconnect();
  });
} catch (error) {
  console.log("server.js error!!!" + error);
}
