import { Router } from "express";
import * as messageController from "./controller/message.js";
import auth, { userAuth } from "../../middleware/auth.js";

const messageRoute = Router();

messageRoute.get(
  "/getMessagesByRabbitMQ",
  auth(userAuth.instructor),
  messageController.getMessagesByRabbitMQ
);
messageRoute.get(
  "/getAllNotification",
  auth(userAuth.instructor),
  messageController.getAllMessages
);

export default messageRoute;
