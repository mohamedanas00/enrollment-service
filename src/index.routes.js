import connectDB from "../DB/connection.js";
import enrollmentRoutes from "./modules/enrollment/enrollment.routes.js";
import logsRoute from "./modules/logs/logs.routes.js";
import { globalErrorHandling } from "./utils/errorHandling.js";

const initApp = (app, express) => {
  app.use(express.json());
  app.use("/enrollment",enrollmentRoutes)
  app.use("/logs",logsRoute)
  app.use(globalErrorHandling);
  app.use("/*", (req, res, next) => {
    return res.json({ message: "In_valid Routing🚫" });
  });
  connectDB();
};

export default initApp;
