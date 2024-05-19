import { StatusCodes } from "http-status-codes";
import messageModel from "../../../../DB/models/message.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { receivedMessage } from "../../../utils/rabbitMqReceived.js";

export const getAllMessages = asyncHandler(async (req, res, next) => {
  const messages = await messageModel.find({ instructorId: req.user.id });
  res.status(StatusCodes.OK).json({ messages });
});

export const getMessagesByRabbitMQ = asyncHandler(async (req, res, next) => {
  const messages = await receivedMessage(req.user.email);
  res.status(StatusCodes.OK).json({ messages });
});
