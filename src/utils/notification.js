import { StatusCodes } from "http-status-codes";
import { ErrorClass } from "./errorClass.js";
import { emailHtml, sendEmail } from "./email.js";
import { sendMessage } from "./rabbitMqSend.js";
import messageModel from "../../DB/models/message.model.js";
export const InstructorNotification = async ({
  req,
  isEnrolled,
  operation,
} = {}) => {
  try {
    const instructorId = isEnrolled.instructor.id;
    const instructorName = isEnrolled.instructor.name;
    const instructorEmail = isEnrolled.instructor.email;
    const courseId = isEnrolled.courseId;
    const courseName = isEnrolled.courseName;
    if (operation == "Enrollment") {
      var text = `Student ${req.user.name} with ID:${req.user.id} made Enrollment in course ${courseName} with ID:${courseId}`;
      var message = `Enrollment in course ${courseName} with ID:${courseId}`;
    } else {
      var text = `Student ${req.user.name} with ID:${req.user.id} made Cancel Enrollment in course ${courseName} with ID:${courseId}`;
      var message = `Cancel Enrollment in course ${courseName} with ID:${courseId}`;
    }

    const html = emailHtml(text, instructorName);

    await messageModel.create({
      instructorId: instructorId,
      studentId: req.user.id,
      studentName: req.user.name,
      studentEmail: req.user.email,
      CourseId: courseId,
      CourseName: courseName,
      Operation: operation,
    });

    const msg = {
      studentName: req.user.name,
      studentEmail: req.user.email,
      CourseId: courseId,
      CourseName: courseName,
      Operation: message,
    };
    await sendMessage(instructorEmail, msg);
    // sendEmail({ to: instructorEmail, subject: operation, html });
  } catch (error) {
    new ErrorClass(
      `Error for creating notify messaging`,
      StatusCodes.BAD_REQUEST
    );
  }
};

export const StudentNotification = async ({
  req,
  isEnrolled,
  operation,
} = {}) => {
  try {
    const studentEmail = isEnrolled.student.email;
    const courseId = isEnrolled.courseId;
    const courseName = isEnrolled.courseName;
    if (operation == "accepted") {
      var text = `Instructor ${req.user.name} accepted your Enrollment in course ${courseName} with ID:${courseId}`;
    } else {
      var text = `Instructor ${req.user.name} rejected your Enrollment in course ${courseName} with ID:${courseId}`;
    }
    const html = emailHtml(text, studentEmail);
    // sendEmail({ to: instructorEmail, subject: operation, html });
  } catch (error) {
    new ErrorClass(
      `Error for creating notify messaging`,
      StatusCodes.BAD_REQUEST
    );
  }
};
