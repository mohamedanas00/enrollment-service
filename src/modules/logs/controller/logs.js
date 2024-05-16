import { StatusCodes } from "http-status-codes";
import logsModel from "../../../../DB/models/logs.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";



export const ViewAllLogs = asyncHandler(async (req, res) => {
    const logs = await logsModel.find();
    res.status(StatusCodes.OK).json({ logs });
})