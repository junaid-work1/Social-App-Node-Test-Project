import express from "express";
import { addlike, dislikePost, getAllLikes, getSinglePostLikes } from "../controllers/likeController.js";
import { isAuth } from "../middlerware/isAuthentication.js";

const router = express.Router();

router.get("/v1/posts-likes", [isAuth], getAllLikes);
router.get("/v1/post-likes/:id", [isAuth], getSinglePostLikes);

router.delete("/v1/dislike-post/:id", [isAuth], dislikePost);

router.post("/v1/like-post", [isAuth], addlike);

export default router;
