import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

import { sendErrorResponse, sendSuccessResponse } from "../helper/apiResponse.js";
import { commentCreationSchema } from "../helper/validationSchema.js";

export const getAllComments = async (req, res) => {
  try {
    const result = await Comment.find().populate([{ path: "user", select: "firstName lastName" }]);
    sendSuccessResponse(res, result, 200, "success");
  } catch (error) {
    sendErrorResponse(res, error, 500, "fail");
  }
};

export const getSinglePostComments = async (req, res) => {
  const { id } = req.params;
  try {
    const comments = await Comment.find({ post: id });
    if (comments.length === 0) return sendErrorResponse(res, "Comments not found", 404, "fail");
    sendSuccessResponse(res, comments, 200, "success");
  } catch (error) {
    sendErrorResponse(res, error, 500, "fail");
  }
};

export const removeComment = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedComment = await Comment.findByIdAndDelete(id);
    if (!deletedComment) return sendErrorResponse(res, "Comment not found", 404, "fail");
    sendSuccessResponse(res, "Comment deleted successfully.", 200, "success");
  } catch (error) {
    sendErrorResponse(res, error, 500, "fail");
  }
};

export const updateComment = async (req, res) => {
  const { id } = req.params;
  const { commentText } = req.body;

  const { error } = commentCreationSchema.validate({ commentText }, { abortEarly: false });
  if (error) return sendErrorResponse(res, error.details, 400, "fail");

  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { commentText },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedComment) return sendErrorResponse(res, "Comment not found", 404, "fail");
    sendSuccessResponse(res, "Comment updated successfully!", 200, "success");
  } catch (error) {
    sendErrorResponse(res, error, 500, "fail");
  }
};

export const addComment = async (req, res) => {
  const { commentText, user, post } = req.body;

  const { error } = commentCreationSchema.validate({ commentText }, { abortEarly: false });
  if (error) return sendErrorResponse(res, error.details, 400, "fail");
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
    const newComment = new Comment({ commentText, user, post });
    const result = await newComment.save();
    sendSuccessResponse(res, result, 200, "success");
  } catch (error) {
    sendErrorResponse(res, error, 500, "fail");
  }
};
