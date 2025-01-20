import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  createCheckoutSession,
  getAllPurchasedCourse,
  getCourseDetailWithPurchaseStatus,
  stripeWebhook,
} from "../controllers/purchaseCourse.controller.js";

const router = express.Router();

router
  .route("/webhook")
  .post(express.raw({ type: "application/json" }), stripeWebhook);

router.use(isAuthenticated);

router.route("/checkout/create-checkout-session").post(createCheckoutSession);
router
  .route("/course/:courseId/detail-with-status")
  .get(getCourseDetailWithPurchaseStatus);
router.route("/").get(getAllPurchasedCourse);

export default router;
