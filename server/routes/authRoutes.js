import express from "express";
import {
  authCheck,
  userLogin,
  userLogout,
  userRegister,
} from "../controllers/authController.js";
import { protectRoute } from "../middleware/protectRoute.js";


const authRouter = express.Router();

authRouter.post("/register", userRegister);
authRouter.post("/login", userLogin);
authRouter.post("/logout", userLogout);
authRouter.get("/authcheck", protectRoute, authCheck);

export default authRouter;
