import express from "express";
import {
  deleteUser,
  getAllUsers,
  getSingleUser,
  logInUser,
  registerUser,
  updateUserData,
  updateUserPassword,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/v1/user-list", getAllUsers);
router.get("/v1/get-single-user/:id", getSingleUser);
router.post("/v1/create-user", registerUser);
router.delete("/v1/delete-user/:id", deleteUser);
router.patch("/v1/update-user/:id", updateUserData);
router.patch("/v1/update-password/:id", updateUserPassword);

router.post("/v1/login-user", logInUser);

export default router;
