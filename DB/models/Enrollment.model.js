import { Schema, model } from "mongoose";

const enrollmentSchema = new Schema({
    courseId: {
        type: String,
        required: true,
        lowercase: true
    },
    student: {
        id: {
            type: Number, 
            required: true
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
    },
    status: {
        type:String, 
        enum : ["accepted", "rejected", "pending"],
        default: "pending"
    }
},
{
    timestamps: true,
}
);

const courseModel = model('Course', courseSchema)

export default courseModel