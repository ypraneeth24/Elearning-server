import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./database/db.js";
import Razorpay from "razorpay";
import cors from "cors";

dotenv.config();

export const instance = new Razorpay({
    key_id: process.env.Razorpay_Key,
    key_secret: process.env.Razorpay_Secret,
});

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.port;

app.get("/" ,(req, res) => {
    res.send("server is working");
});

app.use("/uploads",express.static("uploads"));
//importing user,course,admin routes
import userRoutes from "./routers/user.js";
import courseRoutes from "./routers/course.js";
import adminRoutes from "./routers/admin.js";

//use userRoutes
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", adminRoutes);

app.listen(5000 , () => {
    console.log(`server is running on http://localhost:${PORT}`);
    connectDb();
});