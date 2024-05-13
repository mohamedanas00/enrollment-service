import { Schema, model } from "mongoose";

const messageSchema = new Schema(
    {
        instructorId: {
            type: Number,
            required: true,
        },
        studentId:{
            type: Number,
            required: true,
        },
        studentName: {
            type: String,
            required: true,
        },
        studentEmail: {
            type: String,
            required: true,
        },
        CourseId: {
            type: String,
            required: true,
        },
        CourseName: {
            type: String,
            required: true,
        },
        Operation: {
            type: String,
            enum: ["Enrollment", "Cancel Enrollment"],
            default: "Enrollment",
        },
    },
    {
        timestamps: true,
    }
);

const messageModel = model("Message", messageSchema);

export default messageModel;