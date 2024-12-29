import express from "express";
import {checkOut, fetchLecture, fetchLectures, getAllCourses, getMyCourses, getSingleCourse, paymentVerification } from "../controllers/course.js";
import {isAdmin, isAuth} from "../middlewares/isAuth.js";

const router = express.Router();

router.get("/course/all",getAllCourses);

router.get("/course/:id",getSingleCourse);

router.get("/lectures/:id",isAuth,fetchLectures);

router.get("/lecture/:id",isAuth,fetchLecture);

router.get("/mycourses",isAuth,getMyCourses);

router.post("/course/checkout/:id",isAuth,checkOut);

router.post("/verification/:id",isAuth,paymentVerification);



export default router;