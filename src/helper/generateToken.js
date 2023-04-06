import jwt from "jsonwebtoken";

export const generateToken = (data) => jwt.sign({ data }, process.env.JWT_SECRET, { expiresIn: "24h" });
