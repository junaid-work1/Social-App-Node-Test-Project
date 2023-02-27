import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Comment = mongoose.model("comments", CommentSchema);

export default Comment;
