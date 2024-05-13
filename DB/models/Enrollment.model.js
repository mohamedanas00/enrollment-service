import { Schema, model } from "mongoose";

const enrollmentSchema = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    instructor: {
      id: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    student: {
      id: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["accepted", "rejected", "pending","cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const enrollmentModel = model("Enrollment", enrollmentSchema);

export default enrollmentModel;
