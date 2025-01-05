import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const signupUser = asyncHandler(async (req, res) => {
  const { fullName, email, userName, password } = req.body;

  if (
    [fullName, email, userName, password].some((field) => field?.trim() === "")
  ) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    return res
      .status(409)
      .json(new ApiError(409, "User with email or username already exists"));
  }

  const user = await User.create({
    fullName,
    email,
    userName: userName.toLowerCase(),
    password,
  });

  const createdUser = User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    return res
      .status(500)
      .json(
        new ApiError(500, "Something went wrong while registering the user")
      );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});
export { signupUser };
