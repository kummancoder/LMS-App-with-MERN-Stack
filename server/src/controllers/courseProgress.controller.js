import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { CoursreProgress } from '../model/courseProgress.model.js';
import { isValidObjectId } from 'mongoose';
import { Course } from '../model/course.model.js'

export const getCourseProgress = asyncHandler(async(req,res)=>{
    const {courseId} = req.params;
    const userId = req.user._id;

    if(!isValidObjectId(courseId) || !isValidObjectId(userId)){
        throw new ApiError(404,"courseId and userId are not valid")
    }

    let courseProgress = await CoursreProgress.findOne({courseId,userId}).populate('courseId');

    const courseDetails = await Course.findById(courseId).populate('lectures');

    if(!courseDetails){
        throw new ApiError(404,"Course not found")
    }

    if(!courseProgress){
        return res.status(200).json(
            new ApiResponse(200,{courseDetails,progress:[],completed: false})
        )
    }

    return res.status(200).json(
        new ApiResponse(200,{courseDetails,progress: courseProgress.lectureProgress,completed: courseProgress.completed})
    )
})

export const updateLectureProgress = asyncHandler(async(req,res)=>{
    const {courseId,lectureId} = req.params;
    const userId = req.user._id;

    if(!isValidObjectId(courseId) || !isValidObjectId(userId) || !isValidObjectId(lectureId)){
        throw new ApiError(404,"courseId or userId or lectureId are not valid")
    }

    let courseProgress = await CoursreProgress.findOne({courseId,userId});

    if(!courseProgress){
        courseProgress = new CoursreProgress({
            userId,
            courseId,
            completed: false,
            lectureProgress: []
        })
    }

    const lectureIndex = courseProgress.lectureProgress.findIndex((lecture) => lecture.lectureId === lectureId);

    if(lectureIndex !== -1){
        courseProgress.lectureProgress[lectureIndex].viewed = true;
    } else {
        courseProgress.lectureProgress.push({
            lectureId,viewed: true
        })
    }

    const lectureprogressLength = courseProgress.lectureProgress.filter((lectureprog)=>lectureprog.viewed).length;

    const course = await Course.findById(courseId);

    if(course.lectures.length === lectureprogressLength){
        courseProgress.completed = true;
    }

    await courseProgress.save();

    return res.status(200).json(
        new ApiResponse(200,"Lecture Progress updated successfully")
    )
})

export const markAsCompleted = asyncHandler(async(req,res)=>{
    const {courseId} = req.params;
    const userId = req.user._id;

    if(!isValidObjectId(courseId) || !isValidObjectId(userId)){
        throw new ApiError(404,"courseId and userId are not valid")
    }

    const courseProgress = await CoursreProgress.findOne({courseId,userId});

    if(!courseProgress){
        throw new ApiError(404,"course progress not found")
    }

    courseProgress.lectureProgress.map((lecturepro)=> lecturepro.viewed = true);

    courseProgress.completed = true;

    await courseProgress.save();

    return res.status(200).json(
        new ApiResponse(200,"course marked as completed")
    )
})

export const markAsIncompleted = asyncHandler(async(req,res)=>{
    const {courseId} = req.params;
    const userId = req.user._id;

    if(!isValidObjectId(courseId) || !isValidObjectId(userId)){
        throw new ApiError(404,"courseId and userId are not valid")
    }

    const courseProgress = await CoursreProgress.findOne({courseId,userId});

    if(!courseProgress){
        throw new ApiError(404,"course progress not found")
    }

    courseProgress.lectureProgress.map((lecturepro)=> lecturepro.viewed = false);

    courseProgress.completed = false;

    await courseProgress.save();

    return res.status(200).json(
        new ApiResponse(200,"course marked as Incompleted")
    )
})
