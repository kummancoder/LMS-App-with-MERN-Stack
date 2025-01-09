import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { deleteMediaFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const extractPublicIdFromUrl = (url) => {
  if (!url) {
    throw new Error("URL is missing");
  }
  const segments = url.split("/");
  const fileName = segments.pop();
  if (!fileName.includes(".")) {
    throw new Error("Invalid URL structure");
  }
  return fileName.split(".")[0];
};

const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  if (
    [fullName, email, password].some((field) => !field || field?.trim() === "")
  ) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    return res
      .status(409)
      .json(new ApiError(409, "User with email or username already exists"));
  }

  const user = await User.create({
    fullName,
    email,
    password,
  });

  const createdUser = await User.findById(user._id)
    .select("-password -refreshToken")
    .lean();

  if (!createdUser) {
    return res
      .status(500)
      .json(
        new ApiError(500, "Something went wrong while registering the user")
      );
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered Successfully"));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email.trim()) {
    return res.status(400).json(new ApiError(400, "email is required"));
  }
  if (!password?.trim()) {
    return res.status(400).json(new ApiError(400, "password is required"));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json(new ApiError(404, "User does not exist"));
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return user.status(401).json(new ApiError(401, "Invalid user credentials"));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the fiel
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { fullName } = req.body;
  const avatarLocalPath = req.file?.path;

  if (!fullName && !avatarLocalPath) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          "At least one field (full name or avatar) is required for update"
        )
      );
  }

  let updateFields = {};

  if (fullName) {
    updateFields.fullName = fullName;
  }

  if (avatarLocalPath) {
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar?.url) {
      return res
        .status(400)
        .json(new ApiError(400, "Error while uploading avatar"));
    }

    const user = await User.findById(req.user?._id);
    if (user?.avatar) {
      try {
        const publicId = extractPublicIdFromUrl(user.avatar); 
        await deleteMediaFromCloudinary(publicId); 
      } catch (error) {
        console.error("Error deleting old avatar:", error);
        return res
          .status(500)
          .json(new ApiError(500, "Error deleting old avatar"));
      }
    }
    updateFields.avatar = avatar.url;
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: updateFields,
    },
    { new: true }
  ).select("-password");

  if (!updatedUser) {
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong while updating user"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});

export { register, login, logout, getCurrentUser, updateUserProfile };
