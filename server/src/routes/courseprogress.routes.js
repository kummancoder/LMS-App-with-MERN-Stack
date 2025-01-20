import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { getCourseProgress, markAsCompleted, markAsIncompleted, updateLectureProgress } from '../controllers/courseProgress.controller.js';

const router = express.Router();

router.use(isAuthenticated);

router.route('/:courseId').get(getCourseProgress);
router.route('/:courseId/lecture/:lectureId/view').post(updateLectureProgress);
router.route('/:courseId/complete').post(markAsCompleted);
router.route('/:courseId/incomplete').post(markAsIncompleted);

export default router;