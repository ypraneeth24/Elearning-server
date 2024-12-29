import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

export const isAuth = async(req,res,next) => {
    try {
        const token = req.headers.token;

        if(!token) {
            return res.status(403).json({
                message:"Please Login"
            });
        };

        const decodedData = jwt.verify(token,process.env.Jwt_Sec);
        
        console.log("decoded data :" ,decodedData);
        
        req.user = await User.findById(decodedData._id);

        next();
    } catch (error) {
        res.status(500).json({
            message:"Login First",
        });
    };
};

export const isAdmin = async(req,res,next) => {
    try {
        if(req.user.role !== "admin") {
            return res.status(403).json({
                message:"You are not an Admin",
            });
        }
        next();
    } catch(error) {
        res.status(500).json({
            message:error.message,
        });
    }
};