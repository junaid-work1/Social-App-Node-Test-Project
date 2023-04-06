import express from "express";
import {
  deleteUser,
  emailVerification,
  getAllUsers,
  getSingleUser,
  logInUser,
  registerUser,
  updateUserData,
  updateUserPassword,
} from "../controllers/userController.js";
import { isAuth } from "../middlerware/isAuthentication.js";

const router = express.Router();

router.get("/v1/user-list", [isAuth], getAllUsers);
router.get("/v1/verify-email/:verifaicationCode", emailVerification);

router.route("/v1/user/:id")
    .get([isAuth], getSingleUser)
    .delete([isAuth], deleteUser)
    .patch([isAuth], updateUserData)
    .put([isAuth], updateUserData)

router.patch("/v1/update-password/:id", [isAuth], updateUserPassword);

router.post("/v1/create-user", registerUser);
router.post("/v1/login-user", logInUser);

export default router;
