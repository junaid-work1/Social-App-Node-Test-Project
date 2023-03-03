import jwt from "jsonwebtoken";
import { sendErrorResponse } from "../helper/apiResponse.js";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  const secretKey = process.env.JWT_SECRET;

  if (!token) {
    return sendErrorResponse(res, "Unauthorized", 401, "fail");
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return sendErrorResponse(res, "Unauthorized", 401, "fail");
    }
    req.user = decoded?.data?.id;
    next();
  });
};
