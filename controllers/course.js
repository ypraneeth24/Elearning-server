import { instance } from "../index.js";
import { Courses } from "../models/course.js";
import { Lecture } from "../models/lecture.js";
import { User } from "../models/user.js";
import TryCatch from "./trycatch.js";
import { rm } from "fs";
import crypto from "crypto";
import { Payment } from "../models/Payment.js";

export const getAllCourses = TryCatch(async(req,res) => {
    const courses = await Courses.find();

    res.json({
        courses,
    });
});

export const getSingleCourse = TryCatch(async (req,res) => {
    const course = await Courses.findById(req.params.id);

    res.json({
        course,
    });
});

export const fetchLectures = TryCatch(async(req,res) => {
    const lectures = await Lecture.find({ course:req.params.id });

    const user = await User.findById(req.user._id);

    if( user.role === "admin") {
        return res.json({lectures});
    };

    if( !user.subscription.includes(req.params.id) ) {
        return res.status(400).json({
            message:"Please subscribe to this course to continue",
        })
    };

    res.json({lectures});

})

export const fetchLecture = TryCatch(async(req,res) => {
    const lecture = await Lecture.findById(req.params.id);

    const user = await User.findById(req.user._id);

    if( user.role === "admin") {
        return res.json({lecture});
    };

    if( !user.subscription.includes(lecture.course) ) {
        return res.status(400).json({
            message:"Please subscribe to this course to continue",
        })
    };

    res.json({lecture});

});

export const getMyCourses = TryCatch(async(req,res) => {
    const courses = await Courses.find({_id:req.user.subscription});

    res.json({ courses} );
});

export const checkOut = TryCatch(async(req,res) => {
    const user = await User.findById(req.user._id);

    const course = await Courses.findById(req.params.id);

    if(user.subscription.includes(course._id)) {
        return res.status(400).json({
            message : "You already buyed this Course",
        });
    };

    const options = {
        amount: Number(course.price * 100),
        currency: "INR",
    };

    const order = await instance.orders.create(options);

    res.json({
        order,
        course,
    });
});

export const paymentVerification = TryCatch(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
  
    const body = razorpay_order_id + "|" + razorpay_payment_id;
  
    const expectedSignature = crypto
      .createHmac("sha256", process.env.Razorpay_Secret)
      .update(body)
      .digest("hex");
  
    const isAuthentic = expectedSignature === razorpay_signature;
  
    if (isAuthentic) {
      await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });
  
      const user = await User.findById(req.user._id);
  
      const course = await Courses.findById(req.params.id);
  
      user.subscription.push(course._id);
  
      await user.save();
  
      res.status(200).json({
        message: "Course Purchased Successfully",
      });
    } else {
      return res.status(400).json({
        message: "Payment Failed",
      });
    }
  });
  

