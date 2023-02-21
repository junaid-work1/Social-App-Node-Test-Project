import bcrypt from "bcrypt";

import { sendErrorResponse, sendSuccessResponse } from "../helper/apiResponse.js";
import { generateToken } from "../helper/generateToken.js";
import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "firstName lastName email createdAt");
    return sendSuccessResponse(res, users, 200, "success");
  } catch (error) {
    return sendErrorResponse(res, error, 500, "fail");
  }
};

export const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    if (!password || password.trim() === "") {
      return sendErrorResponse(res, "Password is required", 400, "fail");
    }
    const user = await User.findOne({ email });
    if (user) {
      return sendErrorResponse(res, "User with this email already exists", 409, "fail");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ firstName, lastName, email, password: hashedPassword });
    const savedUser = await newUser.save();
    return sendSuccessResponse(res, savedUser, 201, "success");
  } catch (error) {
    return sendErrorResponse(res, error, 500, "fail");
  }
};

export const getSingleUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId, "firstName lastName email createdAt");
    if (!user) {
      return sendErrorResponse(res, "User not found", 404, "fail");
    }
    return sendSuccessResponse(res, user, 200, "success");
  } catch (error) {
    return sendErrorResponse(res, error, 500, "fail");
  }
};

export const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return sendErrorResponse(res, "User not found", 404, "fail");
    }
    return sendSuccessResponse(res, "User deleted successfully.", 200, "success");
  } catch (error) {
    return sendErrorResponse(res, error, 500, "fail");
  }
};

export const updateUserData = async (req, res) => {
  const userId = req.params.id;
  const { firstName, lastName, email } = req.body;
  const newData = { firstName, lastName, email };

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, newData, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return sendErrorResponse(res, "User not found", 404, "fail");
    }
    return sendSuccessResponse(res, "User data updated successfully!", 200, "success");
  } catch (error) {
    return sendErrorResponse(res, error, 500, "fail");
  }
};

export const updateUserPassword = async (req, res) => {
  const userId = req.params.id;
  const { newPassword, currentPassword } = req.body;

  if (!newPassword || newPassword.trim() === "") {
    return sendErrorResponse(res, "Password is required", 400, "fail");
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return sendErrorResponse(res, "User not found", 404, "fail");
    }
    const isPasswordMatched = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordMatched) {
      return sendErrorResponse(res, "Incorrect password", 401, "fail");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedUser) {
      return sendErrorResponse(res, "User not found", 404, "fail");
    }
    return sendSuccessResponse(res, "Password successfully updated.", 200, "success");
  } catch (error) {
    return sendErrorResponse(res, error, 500, "fail");
  }
};

export const logInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return sendErrorResponse(res, "User not found", 400, "fail");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return sendErrorResponse(res, "Incorrect password", 400, "fail");
    }

    const token = generateToken({ id: user._id });
    const { firstName, lastName } = user;
    const data = { firstName, lastName, email };
    return sendSuccessResponse(res, { token, data }, 200, "success");
  } catch (error) {
    return sendErrorResponse(res, error, 500, "fail");
  }
};
