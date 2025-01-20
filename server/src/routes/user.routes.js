import { Router } from "express";
import {
  login,
  logout,
  register,
  getUserProfile,
  updateProfile,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/profile").get(verifyJWT, getUserProfile);
router
  .route("/profile/update")
  .put(verifyJWT, upload.single("profilePhoto"),updateProfile );

export default router;
