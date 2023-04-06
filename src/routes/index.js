import { Router } from "express";
import userRoutes from "./UserRoutes.js"
import postRoutes from "./PostRoutes.js"
import commentsRoutes from "./CommentRoutes.js"
import likeRoutes from "./LikeRoutes.js"

const rootRouter = Router();

rootRouter.use(userRoutes);
rootRouter.use(postRoutes);
rootRouter.use(commentsRoutes);
rootRouter.use(likeRoutes);

export default rootRouter;
