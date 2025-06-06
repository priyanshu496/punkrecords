import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";
import { User } from "../models/userModel.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies["jwt-punkrecords"];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - token not found" });
    }
    
    const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Protect route error:", error);
    res
      .status(500)
      .json({ success: false, message: "Authentication error" });
  }
};