import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import User from "../models/User.js";
import { generateToken } from "../helper/generateToken.js";
import { sendEmailVerification } from "../services/sendVerficationEmail.js";
import { sendErrorResponse, sendSuccessResponse } from "../helper/apiResponse.js";
import { userCreationSchema, updateUserSchema } from "../helper/validationSchema.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    sendSuccessResponse(res, users, 200, "success");
  } catch (error) {
    sendErrorResponse(res, error, 500, "fail");
  }
};

export const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const verificationCode = uuidv4();

  const { error } = userCreationSchema.validate(req.body, { abortEarly: false });
  if (error) return sendErrorResponse(res, error.details, 400, "fail");
  try {
    if (!password || password.trim() === "") return sendErrorResponse(res, "Password is required", 400, "fail");
    const user = await User.findOne({ email });
    if (user) return sendErrorResponse(res, "User with this email already exists", 409, "fail");
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ firstName, lastName, email, password: hashedPassword, verificationToken: verificationCode });
    await newUser.save();
    await sendEmailVerification(email, verificationCode);
    const data = { firstName, lastName, email };
    sendSuccessResponse(res, data, 201, "success");
  } catch (error) {
    sendErrorResponse(res, error, 500, "fail");
  }
};

export const getSingleUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id, "firstName lastName email createdAt");
    if (!user) return sendErrorResponse(res, "User not found", 404, "fail");
    sendSuccessResponse(res, user, 200, "success");
  } catch (error) {
    sendErrorResponse(res, error, 500, "fail");
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return sendErrorResponse(res, "User not found", 404, "fail");
    await user.remove();
    sendSuccessResponse(res, "User deleted successfully.", 200, "success");
  } catch (error) {
    sendErrorResponse(res, error, 500, "fail");
  }
};

export const updateUserData = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email } = req.body;
  const newData = { firstName, lastName, email };

  const { error } = updateUserSchema.validate(newData, { abortEarly: false });
  if (error) return sendErrorResponse(res, error.details, 400, "fail");
  try {
    const updatedUser = await User.findByIdAndUpdate(id, newData, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) return sendErrorResponse(res, "User not found", 404, "fail");
    sendSuccessResponse(res, "User data updated successfully!", 200, "success");
  } catch (error) {
    sendErrorResponse(res, error, 500, "fail");
  }
};

export const updateUserPassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword, currentPassword } = req.body;

  if (!newPassword || newPassword.trim() === "") return sendErrorResponse(res, "Password is required", 400, "fail");

  try {
    const user = await User.findById(id);
    if (!user) return sendErrorResponse(res, "User not found", 404, "fail");

    const isPasswordMatched = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordMatched) return sendErrorResponse(res, "Incorrect password", 401, "fail");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedUser) return sendErrorResponse(res, "User not found", 404, "fail");

    sendSuccessResponse(res, "Password successfully updated.", 200, "success");
  } catch (error) {
    sendErrorResponse(res, error, 500, "fail");
  }
};

export const logInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }, "+password");

    if (!user) return sendErrorResponse(res, "User not found", 400, "fail");
    if (!user.isVerified) return sendErrorResponse(res, "Email is not verified", 400, "fail");

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) return sendErrorResponse(res, "Incorrect password", 400, "fail");
    const token = generateToken({ id: user._id });
    const { firstName, lastName } = user;
    const data = { firstName, lastName, email };
    sendSuccessResponse(res, { token, data }, 200, "success");
  } catch (error) {
    sendErrorResponse(res, error, 500, "fail");
  }
};

export const emailVerification = async (req, res) => {
  const { verifaicationCode } = req.params;

  try {
    const user = await User.findOne({ verificationToken: verifaicationCode });
    if (!user) return sendErrorResponse(res, "Invalid verification token", 400, "fail");

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    sendSuccessResponse(res, "Your email address has been verified", 200, "success");
  } catch (error) {
    sendErrorResponse(res, error, 500, "fail");
  }
};
