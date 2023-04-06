import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "user",
});
UserSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "user",
});
UserSchema.virtual("likes", {
  ref: "Like",
  localField: "_id",
  foreignField: "user",
});

UserSchema.pre("remove", function (next) {
  this.model("Post").deleteMany({ user: this._id }, next);
  this.model("Comment").deleteMany({ user: this._id }, next);
  this.model("Like").deleteMany({ user: this._id }, next);
});

const User = mongoose.model("User", UserSchema);

export default User;
