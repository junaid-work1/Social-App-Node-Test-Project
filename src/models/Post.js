import mongoose, { Schema } from "mongoose";

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

PostSchema.virtual('comments', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'post'
});
PostSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'post'
});

PostSchema.pre('remove', function(next) {
  this.model('Comment').deleteMany({ post: this._id }, next);
  this.model('Like').deleteMany({ post: this._id }, next);
});

const Post = mongoose.model("Post", PostSchema);

export default Post;
