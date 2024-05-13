import enrollmentModel from "../../../DB/models/Enrollment.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { StatusCodes } from "http-status-codes";
import { sendMessage } from "../../utils/rabbitMqSend.js";
import logsModel from "../../../DB/models/logs.model.js";
import { InstructorNotification } from "../../utils/notification.js";

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
