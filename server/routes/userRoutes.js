import express from "express";
import userAuth from "../middlewares/userAuth.js";
import {
  getUserData,
  updateProfile,
  changePassword,
  deleteAccount,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/me", userAuth, getUserData);
userRouter.put("/update-profile", userAuth, updateProfile);
userRouter.put("/change-password", userAuth, changePassword);
userRouter.delete("/delete-account", userAuth, deleteAccount);

export default userRouter;
