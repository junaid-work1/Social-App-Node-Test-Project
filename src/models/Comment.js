import mongoose, { Schema } from "mongoose";

const CommentSchema = new Schema(
  {
    commentText: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("comments", CommentSchema);

export default Comment;
