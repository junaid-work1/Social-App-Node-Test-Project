import mongoose from "mongoose";
const Schema = mongoose.Schema;

const LikeSchema = new Schema({
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

const Like = mongoose.model("Like", LikeSchema);

export default Like