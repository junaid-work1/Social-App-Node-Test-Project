import express from "express";
import { addComment, getAllComments, getSinglePostComments, removeComment, updateComment } from "../controllers/commentController.js";
import { isAuth } from "../middlerware/isAuthentication.js";

const router = express.Router();

router.get("/v1/comment-list", [isAuth], getAllComments);
router.get("/v1/post-comments/:id", [isAuth], getSinglePostComments);

router.route("/v1/comment/:id")
    .put([isAuth], updateComment)
    .patch([isAuth], updateComment)
    .delete([isAuth], removeComment)

router.post("/v1/add-comment", [isAuth], addComment);

export default router;
