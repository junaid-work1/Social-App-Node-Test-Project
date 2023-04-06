import express from "express";
import { createPost, getAllPosts, getSinglePost, removePost, updatePostData } from "../controllers/postController.js";
import { isAuth } from "../middlerware/isAuthentication.js";

const router = express.Router();

router.get("/v1/post-list", [isAuth], getAllPosts);

router.route("/v1/post/:id")
    .get([isAuth], getSinglePost)
    .delete([isAuth], removePost)
    .patch([isAuth], updatePostData)
    .put([isAuth], updatePostData)

router.post("/v1/create-post", [isAuth], createPost);

export default router;
