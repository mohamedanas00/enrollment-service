import connectDB from "../DB/connection.js";
import enrollmentRoutes from "./modules/enrollment/enrollment.routes.js";
import logsRoute from "./modules/logs/logs.routes.js";
import messageRoute from "./modules/message/message.routes.js";
import { globalErrorHandling } from "./utils/errorHandling.js";

const initApp = (app, express) => {
  app.use(express.json());
  app.use("/enrollment",enrollmentRoutes)
  app.use("/logs",logsRoute)
  app.use("/notification",messageRoute)
  app.use(globalErrorHandling);
  app.use("/*", (req, res, next) => {
    return res.status(404).json({ message: "In_valid Routing🚫" });
  });
  connectDB();
};

export default initApp;
