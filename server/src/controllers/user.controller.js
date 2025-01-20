import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js'
import { generateToken } from '../utils/generateToken.js';
import { deleteMediafromCloudinary, uploadMedia } from '../utils/Cloudinary.js';

export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password || [name, email, password].some((field) => field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({ email });

    if (user) {
        throw new ApiError(400, "User already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )
})

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!password || !email || [email, password].some((field) =>
        field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(400, "Email or password is incorrect")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(400, "Email or password is incorrect")
    }

    generateToken(res, user, `Welcome back ${user.name}`);

})

export const logout = asyncHandler(async (_, res) => {
    const options = {
        httpOnly: true,
        secure: true,
        maxAge: 0
    }
    return res.status(200).clearCookie("token", options,).json(
        new ApiResponse(200, "User Logged out Successfully")
    )
})

export const getUserProfile = asyncHandler(async (req, res) => {

    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(404, "User profile not found");
    }

    const user = await User.findById(userId).select('-password').populate('enrolledCourses')

    if(!user){
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Profile fetched successfully")
        )
})

export const updateProfile = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const profilePhotoPath = req.file?.path;

    if (!profilePhotoPath || !req.file.mimetype.startsWith('image/')) {
        throw new ApiError(400, "Invalid file or file is missing")
    }

    if (req.user.photoUrl) {
        const publicId = req.user.photoUrl.split('/').pop().split('.')[0];
        deleteMediafromCloudinary(publicId);
    }

    const cloudResponse = await uploadMedia(profilePhotoPath);
    const photoUrl = cloudResponse.secure_url;

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                name,
                photoUrl
            }
        },{new: true}
    ).select('-password')

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Profile updated successfully")
        )
})