import enrollmentModel from "../../../DB/models/Enrollment.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { StatusCodes } from "http-status-codes";
import logsModel from "../../../DB/models/logs.model.js";
import { InstructorNotification } from "../../utils/notification.js";
import { UpdateEnrollmentCountWithCircuitBreaker } from "../../utils/UpdateCourseAPI.js";

export const EnrollmentCourse = asyncHandler(async (req, res) => {
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
  if (checking!==true) {
    return res.status(StatusCodes.BAD_REQUEST).json({ checking }); 
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

export const CancelEnrollmentCourse = asyncHandler(async (req, res) => {
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

export const ManageEnrollmentCourse = asyncHandler(async (req, res) => {
    const { Id } = req.params;
    const { status } = req.body;
    const instructor = req.user;

    const isEnroll = await enrollmentModel.findOne({
      _id: Id,
      "instructor.id": instructor.id,
    })

    if (!isEnroll) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
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
    })
    InstructorNotification({ req, isEnrolled, operation: status });

    res.status(StatusCodes.OK).json({ isEnrolled });
 
});

export const getPendingEnrollments = asyncHandler(async (req, res) => {
  const student = req.user;
  const enrollments = await enrollmentModel
    .find({ "student.id": student.id, status: "pending" })
  res.status(StatusCodes.OK).json({ enrollments });
})

export const getPastEnrollments = asyncHandler(async (req, res) => {
    const enrollments = await enrollmentModel
      .find({ "student.id": req.user.id, status: { $ne: "pending" } })
    res.status(StatusCodes.OK).json({ enrollments });
  
});

export const checkIsEnrolled = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const {userId} = req.query
  console.log(userId);
  console.log(courseId);
  const isEnrolled = await enrollmentModel.findOne({
    courseId,
    "student.id": userId,
    status: "accepted",
  });
  if (!isEnrolled) {
    return res.status(StatusCodes.CONFLICT).json({ message: "Not enrolled" });
  }
  res.status(StatusCodes.OK).json({ message: "Enrolled" });
});

export const test = asyncHandler(async (req, res) => {
  const x= await UpdateEnrollmentCountWithCircuitBreaker("673eb6f96366cdca81b05e85")
  console.log(x);
  res.status(StatusCodes.OK).json({ x });
})