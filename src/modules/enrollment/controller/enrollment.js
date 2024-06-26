import enrollmentModel from "../../../../DB/models/Enrollment.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { StatusCodes } from "http-status-codes";
import logsModel from "../../../../DB/models/logs.model.js";
import {
  InstructorNotification,
  StudentNotification,
} from "../../../utils/notification.js";
import { UpdateEnrollmentCountWithCircuitBreaker } from "../../../utils/UpdateCourseAPI.js";

export const EnrollmentCourse = asyncHandler(async (req, res, next) => {
  const student = req.user;
  var { courseId, courseName, instructorId, instructorEmail, instructorName } =
    req.body;
  const isEnroll = await enrollmentModel.findOne({
    courseId,
    "student.id": student.id,
  });
  if (isEnroll) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ message: "Already enrolled" });
  }
  const checking = await UpdateEnrollmentCountWithCircuitBreaker(courseId);
  console.log(checking);
  if (checking.status !== 200) {
    return res.status(checking.status).json({ message: checking.message });
  }
  const isEnrolled = await enrollmentModel.create({
    courseId,
    courseName,
    student: { id: student.id, name: student.name, email: student.email },
    instructor: {
      id: instructorId,
      name: instructorName,
      email: instructorEmail,
    },
  });
  InstructorNotification({ req, isEnrolled, operation: "Enrollment" });
  await logsModel.create({
    userId: student.id,
    email: student.email,
    role: student.role,
    action: `Enrolled in course ${courseName}`,
  });
  res.status(StatusCodes.CREATED).json({ isEnrolled });
});

export const CancelEnrollmentCourse = asyncHandler(async (req, res, next) => {
  const student = req.user;
  const { Id } = req.params;
  const isEnrolled = await enrollmentModel.findOne({
    _id: Id,
    "student.id": student.id,
  });
  if (!isEnrolled) {
    return res.status(StatusCodes.CONFLICT).json({ message: "Not enrolled" });
  }
  if (isEnrolled.status == "cancelled") {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ message: "Already cancelled" });
  }
  console.log(isEnrolled);
  isEnrolled.status = "cancelled";
  const CancelEnrollment = await isEnrolled.save();
  InstructorNotification({ req, isEnrolled, operation: "Cancel Enrollment" });
  await logsModel.create({
    userId: student.id,
    email: student.email,
    role: student.role,
    action: `Cancel Enrolled in course ${isEnrolled.courseName}`,
  });
  res.status(StatusCodes.OK).json({ CancelEnrollment });
});

export const ManageEnrollmentCourse = asyncHandler(async (req, res, next) => {
  const { Id } = req.params;
  const { status } = req.body;
  const instructor = req.user;

  const isEnroll = await enrollmentModel.findOne({
    _id: Id,
    "instructor.id": instructor.id,
  });

  if (!isEnroll) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Unauthorized" });
  }
  if (isEnroll.status == status) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ message: "Already in this status" });
  }
  isEnroll.status = status;
  const isEnrolled = await isEnroll.save();

  await logsModel.create({
    userId: req.user.id,
    email: req.user.email,
    role: req.user.role,
    action: `Manage Enrolled in course ${isEnrolled.courseName} with status ${status}`,
  });
  StudentNotification({ req, isEnrolled, operation: status });

  res.status(StatusCodes.OK).json({ isEnrolled });
});

export const getPendingEnrollments = asyncHandler(async (req, res, next) => {
  const student = req.user;
  const enrollments = await enrollmentModel.find({
    "student.id": student.id,
    status: "pending",
  });
  res.status(StatusCodes.OK).json({ enrollments });
});

export const getPastEnrollments = asyncHandler(async (req, res, next) => {
  const enrollments = await enrollmentModel.find({
    "student.id": req.user.id,
    status: "accepted",
  });
  res.status(StatusCodes.OK).json({ enrollments });
});

export const getInstructorEnrollments = asyncHandler(async (req, res, next) => {
  const enrollments = await enrollmentModel.find({
    "instructor.id": req.user.id,
  });
  res.status(StatusCodes.OK).json({ enrollments });
});

//?Using in another microservice to check if user is enrolled
export const checkIsEnrolled = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const { userId } = req.query;
  const isEnrolled = await enrollmentModel.findOne({
    courseId,
    "student.id": userId,
    status: "accepted",
  });
  if (!isEnrolled) {
    return res.status(500).json({ message: "Not enrolled" });
  }
  res.status(StatusCodes.OK).json({ message: "Enrolled" });
});
//?using in another microservice to delete enrollment
export const DeleteEnrollmentCourses = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  await enrollmentModel.deleteMany({ courseId });
  res.status(StatusCodes.OK).json({ message: "Deleted" });
});
//?using in another microservice to delete enrollment
//*updating name of course in enrollments
export const UpdateCourseName = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const { name } = req.body;
  await enrollmentModel.updateMany(
    { courseId },
    { $set: { courseName: name } }
  );
  res.status(StatusCodes.OK).json({ message: "Updated" });
});
