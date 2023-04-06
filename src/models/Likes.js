import mongoose, { Schema } from "mongoose";

const LikeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Like = mongoose.model("Like", LikeSchema);

export default Like;
