import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createCourse } from "../controllers/course.controllers.js";

const router = Router();

router.route("/").post(verifyJWT,createCourse);

export default router;
