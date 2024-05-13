
import { Schema, model } from "mongoose";

const logsSchema = new Schema({
    userId: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true,
    }
},
{
    timestamps: true,
}
);

const logsModel = model('Logs', logsSchema)

export default logsModel