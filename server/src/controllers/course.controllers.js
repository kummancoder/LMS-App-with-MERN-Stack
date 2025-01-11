import { asyncHandler } from "../utils/asyncHandler.js";
import { Course } from "../models/course.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createCourse = asyncHandler(async (req, res) => {
  const { courseTitle, category } = req.body;
  if (!courseTitle || !category) {
    throw new ApiError(400, "Course title and category are required");
  }

  const course = await Course.create({
    courseTitle,
    category,
    creator: req.user?._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, course, "Course created successfully"));
});
