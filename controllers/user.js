import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail from "../middlewares/sendMail.js";
import TryCatch from "./trycatch.js";
import dotenv from "dotenv";

dotenv.config();

export const register = TryCatch(async (req, res) => {
  const { email, name, password } = req.body;

  // Check if the user already exists
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      message: "user already exists",
    });
  }

  // Hash the password
  const hashedPass = await bcrypt.hash(password, 10);

  // Logging for debugging
  console.log('Hashed Password:', hashedPass);

  // Create a new user object
  user = {
    name,
    email,
    password: hashedPass,
  };

  // Generate OTP
  const otp = Math.floor(Math.random() * 1000000);
  console.log('Generated OTP:', otp);

  // Generate activation token
  const activationToken = jwt.sign(
    {
      user,
      otp,
    },
    process.env.Activation_Secret,
    {
      expiresIn: "5m",
    }
  );

  // Prepare email data
  const data = {
    name,
    otp,
  };

  // Logging for debugging
  console.log('Email Data:', data);

  // Send verification email
  await sendMail(email, "E learning", data);

  res.status(200).json({
    message: "Otp sent to your mail",
    activationToken,
  });
});

export const verifyUser = TryCatch(async (req, res) => {
  const { otp, activationToken } = req.body;

  const verify = jwt.verify(activationToken, process.env.Activation_Secret);

  if(!verify) {
    return res.status(400).json({
      message:"Otp expired",
    });
  };

  if (verify.otp !== otp) {
    return res.status(400).json({
      message:"wrong otp",
    });
  };

  await User.create({
    name: verify.user.name,
    email: verify.user.email,
    password: verify.user.password,
  });

  res.json({ message:"User Resgistered",});
});

export const loginUser = TryCatch(async(req,res) => {
  const {email,password} = req.body;
  const user = await User.findOne({email});

  if(!user) {
    return res.status(400).json({
      message:"No user is with that email",
    });
  };

  const pass = await bcrypt.compare(password,user.password);

  if(!pass) {
    return res.status(400).json({
      message:"wrong password",
    });
  };

  const token = jwt.sign({_id:user._id},process.env.Jwt_Sec,{
      expiresIn:"15d",
    }
  );

  res.json({ 
    message:`welcome back ${user.name}`,
    token,
    user,
  });
});

export const myProfile = TryCatch(async(req,res) => {
  const user = await User.findById(req.user._id);

  res.json({user});
})
