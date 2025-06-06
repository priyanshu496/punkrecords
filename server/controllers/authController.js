import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/punkToken.js";
import { User } from "../models/userModel.js";

export const userRegister = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Required missing properties❗" });
    }

    if (password.length < 8) {
      return res.status(406).json({
        success: false,
        message: "Password should contain more than 8 characters.",
      });
    }

    const isUserExist = await User.findOne({ email: email });

    if (isUserExist) {
      return res
        .status(403)
        .json({ success: false, message: "⚠️User already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      createdAt: Date.now(),
    });
    
    // Wait for user to be saved before proceeding
    await newUser.save();
    
    // Generate token and set cookie
    generateTokenAndSetCookie(newUser._id, res);
    
    // Return user data for frontend to use
    return res.status(201).json({ 
      success: true, 
      message: "User registered successfully✅",
      user: {
        id: newUser._id,
        email: newUser.email,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    console.log("Error in the user authentication file", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and Password required" });
    }

    const findUser = await User.findOne({ email: email });

    if (!findUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found❌" });
    }

    // FIXED: Added await here - this was a critical bug
    const isPasswordMatch = await bcrypt.compare(password, findUser.password);

    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password." });
    }

    // Generate token and set cookie
    generateTokenAndSetCookie(findUser._id, res);

    // FIXED: Return user object that matches frontend expectations
    res.status(200).json({
      success: true,
      message: "Login successful✅",
      user: {
        id: findUser._id,
        email: findUser.email,
        createdAt: findUser.createdAt
      }
    });
  } catch (error) {
    console.log("Error in userLogin", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const userLogout = async (req, res) => {
  try {
    res.clearCookie("jwt-punkrecords");
    res.status(200).json({ success: true, message: "User logged out😔" });
  } catch (error) {
    console.log("error user logout!", error);
    // FIXED: res.json(500) should be res.status(500).json()
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

export const authCheck = async (req, res) => {
  try {
    console.log("Auth check - user:", req.user);
    
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    
    res.status(200).json({ 
      success: true, 
      user: {
        id: req.user._id || req.user.id,
        email: req.user.email,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.log("Error in authcheckcontroller", error.message);
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
};