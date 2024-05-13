import { Router } from "express";
import * as enrollmentController from "./controller/enrollment.js";
import auth, { userAuth } from "../middleware/auth.js";

const enrollmentRoutes = Router();


enrollmentRoutes.post('/enroll',auth(userAuth.student), enrollmentController.EnrollmentCourse);


export default enrollmentRoutes