import {Router} from 'express'
import * as logsController from "./controller/logs.js";
import auth, { userAuth } from '../../middleware/auth.js';



const logsRoute = Router();

logsRoute.get('/ViewAllLogs',auth(userAuth.admin),logsController.ViewAllLogs)

export default logsRoute