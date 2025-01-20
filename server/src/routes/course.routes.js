import isAuthenticated from '../middlewares/isAuthenticated.js';
import express from 'express'
import { createCourse, createLecture, deleteCourse, editCourse, EditLecture, getCourseById, getCourseLecture, getCreatorCourses, getLectureById, getPublishedCourse, removeLecture, searchCourse, togglePublishCourse } from '../controllers/course.controller.js';
import upload from '../utils/multer.js'

const router = express.Router();

router.route('/published-courses').get(getPublishedCourse);

router.use(isAuthenticated);

router.route('/').post(createCourse);
router.route('/search').get(searchCourse);
router.route('/').get(getCreatorCourses);
router.route('/:courseId').put(upload.single('courseThumbnail'), editCourse);
router.route('/:courseId').delete(deleteCourse);
router.route('/:courseId').get(getCourseById);
router.route('/:courseId/lecture').post(createLecture);
router.route('/:courseId/lecture').get(getCourseLecture);
router.route('/:courseId/lecture/:lectureId').post(EditLecture);
router.route('/lecture/:lectureId').delete(removeLecture);
router.route('/lecture/:lectureId').get(getLectureById);
router.route('/:courseId').patch(togglePublishCourse);

export default router;