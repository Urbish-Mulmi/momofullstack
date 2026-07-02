// main logic that routes are meant to do is in controller.js:

import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const isProduction = process.env.NODE_ENV === "production";

// handler function for registerUser
export const registerUser = async (req, res) => {
  try {
    console.log(req.body);

    const { fullName, email, password } = req.body;    

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "user already exists with this email",
        success: false,
        existingUser
      });
    }

    // password hashing
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      fullName,
      email,
      password: hashedPassword,
    });

    // JWT token creation
    const token = jwt.sign(
      {
        // _id is auto created by mongoDB for every document, we are using that as the unique identifier for the user in the token as well.
        id: user._id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "user signed up",
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
      success: false,
      error: error.message,
    });
  }
};

// handler function for loginUser
export const loginUser = async (req, res) => {
  try {
    const {email, password} = req.body;

    const user = await userModel.findOne({email});

    if(!user){
      return res.status(404).json({
        message: "user with this email not found",
        success:false
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
      return res.status(400).json({
        message:"Incorect password",
        success:false
      })
    }

     const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      message:"user log in success",
      success:true,
      user
    })

    
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
      success: false,
      error: error.message,
    });
  }
};

// handler function for logoutUser
export const logoutUser =  (req, res) => {
  try { 
   
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });
    res.status(200).json({
      message:"user logged out",
      logoutsuccess:true  ,   
    });
    
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
      success: false,
      error: error.message,
      
    });
  }
}

// handler function for displaying current logged in user info 
export const getMe = async (req,res)=>{

  try {
    // get the clearance pass stored in request header which was added by verify token middleware after successful verification of token.
    const user = req.user;

    if(!user){
      return res.status(404).json({
        message: "user not found",
        success:false,
      })
    }
    res.status(200).json({
      mesage: "user fetched success",
      success: true,
      user,
    })
    
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
      success: false,
      error: error.message,
    });
  }
}