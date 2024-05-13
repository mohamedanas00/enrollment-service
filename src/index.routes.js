import connectDB from "../DB/connection.js";
import enrollmentRoutes from "./modules/enrollment.routes.js";
import { globalErrorHandling } from "./utils/errorHandling.js";

const initApp = (app, express) => {
  app.use(express.json());
  app.use("/enrollment",enrollmentRoutes)
  app.use(globalErrorHandling);
  app.use("/*", (req, res, next) => {
    return res.json({ message: "In_valid Routing🚫" });
  });
  connectDB();
};

export default initApp;
