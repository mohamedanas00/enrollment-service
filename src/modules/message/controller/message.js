import { StatusCodes } from "http-status-codes";
import messageModel from "../../../../DB/models/message.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";



export const getAllMessages = asyncHandler(async (req, res) => {
    const messages = await messageModel.find();
    res.status(StatusCodes.OK).json({ messages });
})

export const getMessagesByRabbitMQ = asyncHandler(async (req, res) => {
    const messages = await receivedMessage(req.user.email);
    res.status(StatusCodes.OK).json({ messages });
})