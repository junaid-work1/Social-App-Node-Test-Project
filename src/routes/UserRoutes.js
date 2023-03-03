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
import { verifyToken } from "../middlerware/verifyToken.js";

const router = express.Router();

router.get("/v1/user-list", [verifyToken], getAllUsers);
router.get("/v1/get-single-user/:id", [verifyToken], getSingleUser);
router.get("/v1/verify-email/:verifaicationCode", emailVerification);

router.delete("/v1/delete-user/:id", [verifyToken], deleteUser);
router.patch("/v1/update-user/:id", [verifyToken], updateUserData);
router.patch("/v1/update-password/:id", [verifyToken], updateUserPassword);

router.post("/v1/create-user", registerUser);
router.post("/v1/login-user", logInUser);
export default router;
