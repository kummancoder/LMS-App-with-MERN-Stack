import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadMedia } from "../utils/Cloudinary.js";

const router = express.Router();

router.route("/upload-video").post(upload.single("file"), async (req, res) => {
  try {
    const result = await uploadMedia(req.file?.path);
    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error during uploading file",
    });
  }
});

export default router;