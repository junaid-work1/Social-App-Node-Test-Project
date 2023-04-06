import Like from "../models/Likes.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

import { sendErrorResponse, sendSuccessResponse } from "../helper/apiResponse.js";

export const getAllLikes = async (req, res) => {
  try {
    const result = await Like.find().populate({ path: "user", select: "firstName lastName" });
    sendSuccessResponse(res, result, 200, "success");
  } catch (error) {
    sendErrorResponse(res, error, 500, "fail");
  }
};

export const getSinglePostLikes = async (req, res) => {
  const { id } = req.params;
  try {
    const results = await Like.find({ post: id });
    sendSuccessResponse(res, results, 200, "success");
  } catch (error) {
    sendErrorResponse(res, error, 500, "fail");
  }
};

export const dislikePost = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Like.findByIdAndDelete(id);
    if (!result) return sendErrorResponse(res, "Something went wrong.", 404, "fail");
    sendSuccessResponse(res, "Post disliked successfully.", 200, "success");
  } catch (error) {
    sendErrorResponse(res, error, 500, "fail");
  }
};

export const addlike = async (req, res) => {
  const { user, post } = req.body;

  try {
    // Check if user exists
    const foundUser = await User.findOne({ _id: user });
    if (!foundUser) {
      return sendErrorResponse(res, "User not found", 404, "fail");
    }
    // Check if post exists
    const foundPost = await Post.findOne({ _id: post });
    if (!foundPost) {
      return sendErrorResponse(res, "Post not found", 404, "fail");
    }
    
    const response = new Like({ user, post });
    const result = await response.save();
    sendSuccessResponse(res, result, 200, "success");
  } catch (error) {
    sendErrorResponse(res, error, 500, "fail");
  }
};
