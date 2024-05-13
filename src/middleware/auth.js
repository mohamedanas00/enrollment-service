import { StatusCodes } from "http-status-codes";
import { ErrorClass } from "../utils/errorClass.js";
import { asyncHandler } from "../utils/errorHandling.js";
import { verifyToken } from "../utils/VerifyToken.js";


export const userAuth = {
    student: ['student'],
    instructor:['instructor'],
    admin:['admin'],
    superAdmin:['admin','instructor']
}

Object.freeze(userAuth)
const auth = (userRoles = []) => {
    return asyncHandler(async (req, res, next) => {
        const { token } = req.headers;
        if(!token){
            return next(new ErrorClass("In-valid token", StatusCodes.BAD_REQUEST))
        }
        const decode = verifyToken(token)
        if (!decode.id) {
            return next(new ErrorClass("In-valid token payload", StatusCodes.BAD_REQUEST))
        }
        if (!userRoles.includes(decode.role)) {
            return next(new ErrorClass("Permission Denied🚫!", StatusCodes.UNAUTHORIZED))
        }
        console.log(decode);
        req.user = decode
        return next()
    })
}
export default auth



