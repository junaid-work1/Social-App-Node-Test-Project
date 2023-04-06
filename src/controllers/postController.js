import Post from "../models/Post.js";
import { sendErrorResponse, sendSuccessResponse } from "../helper/apiResponse.js";
import { postCreationSchema } from "../helper/validationSchema.js";

export const getAllPosts = async (req, res) => {
  try {
    const result = await Post.find().populate({ path: "user", select: "firstName lastName email" });
    sendSuccessResponse(res, result, 200, "success");
  } catch (error) {
    sendErrorResponse(res, error, 500, "fail");
  }
};

export const getSinglePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id).populate({ path: "user", select: "firstName lastName email" });
    if (!post) return sendErrorResponse(res, "Post not found", 404, "fail");
    sendSuccessResponse(res, post, 200, "success");
  } catch (error) {
    sendErrorResponse(res, error, 500, "fail");
  }
};

export const removePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) return sendErrorResponse(res, "Post not found", 404, "fail");
    await post.remove();
    sendSuccessResponse(res, "Post deleted successfully.", 200, "success");
  } catch (error) {
    sendErrorResponse(res, error, 500, "fail");
  }
};

export const updatePostData = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const newData = { title, description };

  const { error } = postCreationSchema.validate(newData, { abortEarly: false });
  if (error) return sendErrorResponse(res, error, 400, "fail");
  try {
    const updatedPost = await Post.findByIdAndUpdate(id, newData, {
      new: true,
      runValidators: true,
    });
    if (!updatedPost) return sendErrorResponse(res, "Post not found", 404, "fail");
    sendSuccessResponse(res, "Post data updated successfully!", 200, "success");
  } catch (error) {
    sendErrorResponse(res, error, 500, "fail");
  }
};

export const createPost = async (req, res) => {
  const { title, description, user, isPublished } = req.body;

  const { error } = postCreationSchema.validate({ title, description }, { abortEarly: false });
  if (error) return sendErrorResponse(res, error, 400, "fail");
  try {
    const newPost = new Post({ title, description, user, isPublished });
    const result = await newPost.save();
    sendSuccessResponse(res, result, 200, "success");
  } catch (error) {
    sendErrorResponse(res, error, 500, "fail");
  }
};
