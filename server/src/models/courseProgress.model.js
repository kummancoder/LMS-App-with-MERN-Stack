import mongoose from 'mongoose';

const lectureProgressSchema = new mongoose.Schema({
    lectureId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Lecture'
    },
    viewed: {
        type: Boolean
    }
})

const courseProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    courseId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course'
    },
    completed: {
        type: Boolean
    },
    lectureProgress: [lectureProgressSchema]
})

export const CoursreProgress = mongoose.model('CourseProgress',courseProgressSchema);