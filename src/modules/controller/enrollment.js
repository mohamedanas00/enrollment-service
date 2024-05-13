import enrollmentModel from "../../../DB/models/Enrollment.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { StatusCodes } from "http-status-codes";
import { sendMessage } from "../../utils/rabbitMqSend.js";
import logsModel from "../../../DB/models/logs.model.js";
import { InstructorNotification } from "../../utils/notification.js";



export const EnrollmentCourse = asyncHandler(async (req, res) => {
    const student = req.user;
    var {courseId, courseName,instructorEmail} = req.body;
    const isEnrolled = await enrollmentModel.findOne({ courseId, 'student.id': student.id });
    if(isEnrolled){
        return res.status(StatusCodes.CONFLICT).json({ message: "Already enrolled" });
    }
    const Enrollment= await enrollmentModel.create({courseId, courseName,
        student: { id: student.id, name: student.name, email: student.email }
    });
    instructorEmail= "mohamed.edris7688@gmail.com"
    InstructorNotification({req,instructorName:student.name,instructorEmail,courseId,courseName,operation:"Enrollment"})
    await logsModel.create({userId:student.id,email:student.email,role:student.role,action:`Enrolled in course ${courseName}`})    
    res.status(StatusCodes.CREATED).json({ Enrollment });
});