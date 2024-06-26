import { Router } from "express";
import * as enrollmentController from "./controller/enrollment.js";
import auth, { userAuth } from "../../middleware/auth.js";

const enrollmentRoutes = Router();

enrollmentRoutes.post(
  "/enroll",
  auth(userAuth.student),
  enrollmentController.EnrollmentCourse
);
enrollmentRoutes.patch(
  "/CancelEnroll/:Id",
  auth(userAuth.student),
  enrollmentController.CancelEnrollmentCourse
);
enrollmentRoutes.patch(
  "/ManageEnroll/:Id",
  auth(userAuth.instructor),
  enrollmentController.ManageEnrollmentCourse
);
enrollmentRoutes.get(
  "/GetCurrentEnroll",
  auth(userAuth.student),
  enrollmentController.getPendingEnrollments
);
enrollmentRoutes.get(
  "/GetPastEnroll",
  auth(userAuth.student),
  enrollmentController.getPastEnrollments
);
enrollmentRoutes.get(
  "/CheckIsEnrolled/:courseId",
  enrollmentController.checkIsEnrolled
);
enrollmentRoutes.delete(
  "/DeleteEnroll/:courseId",
  enrollmentController.DeleteEnrollmentCourses
);
enrollmentRoutes.patch(
  "/UpdateEnrolledCourse/:courseId",
  enrollmentController.UpdateCourseName
);

enrollmentRoutes.get(
  "/GetInstructorEnroll",
  auth(userAuth.instructor),
  enrollmentController.getInstructorEnrollments
);

export default enrollmentRoutes;
