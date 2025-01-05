import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["instructor", "student"],
      default: "student",
    },
    enrolledCourses: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
    avatar: {
      type: String,
      default: "",
    },
    refreshToken: {
      type: String,
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
