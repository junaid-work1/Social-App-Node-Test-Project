import jwt from "jsonwebtoken";

export const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);
