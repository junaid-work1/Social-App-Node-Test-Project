import Joi from "joi";

export const userCreationSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const updateUserSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
});

export const postCreationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().min(30).required(),
});

export const commentCreationSchema = Joi.object({
  commentText: Joi.string().required(),
});
