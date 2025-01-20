import { PurchaseCourse } from "../models/purchaseCourse.model.js";
import { Course } from '../models/course.model.js';
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";
import Stripe from 'stripe';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';;
import { ApiError } from '../utils/ApiError.js';
import { isValidObjectId } from "mongoose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "UserId is not valid")
    }
    const userIdString = userId.toString();
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
        throw new ApiError(404, "Course not found")
    }

    const newPurchase = new PurchaseCourse({
        courseId,
        userId,
        amount: course.coursePrice,
        status: 'pending'
    })

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: course.courseTitle,
                        images: [course.courseThumbnail],
                    },
                    unit_amount: course.coursePrice * 100, // Amount in paise (lowest denomination)
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: `http://localhost:5173/course-progress/${courseId}`, // once payment successful redirect to course progress page
        cancel_url: `http://localhost:5173/course-detail/${courseId}`,
        metadata: {
            courseId: courseId,
            userId: userIdString,
        },
        shipping_address_collection: {
            allowed_countries: ["IN"], // Optionally restrict allowed countries
        },
    });

    if (!session.url) {
        throw new ApiError(400, "Error while creating the session")
    }

    newPurchase.paymentId = session.id;
    await newPurchase.save();

    return res.status(200).json(
        new ApiResponse(200, session.url, "Session Url generated successfully")
    )
})

export const stripeWebhook = asyncHandler(async (req, res) => {
    let event;
    const signature = req.headers['stripe-signature'];
    const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

    try {
        // Use raw body directly
        event = stripe.webhooks.constructEvent(req.body, signature, secret);
    } catch (error) {
        console.error('Webhook error:', error.message);
        return res.status(400).send(`Webhook error: ${error.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        const purchase = await PurchaseCourse.findOne({ paymentId: session.id }).populate('courseId');

        if (!purchase) {
            console.error('Purchase not found for session ID:', session.id);
            return res.status(404).send('Purchase not found');
        }

        purchase.status = 'completed';

        if (purchase.courseId && purchase.courseId.lectures) {
            await Lecture.updateMany(
                { _id: { $in: purchase.courseId.lectures } },
                { $set: { isPreviewFree: true } }
            );
        }

        await purchase.save();

        await User.findByIdAndUpdate(
            purchase.userId,
            { $addToSet: { enrolledCourses: purchase.courseId._id } },
            { new: true }
        );

        await Course.findByIdAndUpdate(
            purchase.courseId._id,
            { $addToSet: { enrolledStudents: purchase.userId } },
            { new: true }
        );

        return res.status(200).send('Webhook processed successfully');
    }

    return res.status(200).send('Event type not handled');
});

export const getCourseDetailWithPurchaseStatus = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    if (!isValidObjectId(courseId)) {
        throw new ApiError(400, "UserId is not valid")
    }

    const userId = req.user?._id;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "UserId is not valid")
    }

    const course = await Course.findById(courseId).populate({ path: 'creator' }).populate({ path: 'lectures' });

    const purchased = await PurchaseCourse.findOne({userId,courseId}).lean();
    if(!course){
        throw new ApiError(404,"Course not found")
    }

    return res.status(200).json(
        new ApiResponse(200,{course,purchased: !!purchased}) // same as purchased: purchased ? true : false
    )

})

export const getAllPurchasedCourse = asyncHandler(async(_,res)=>{
    const purchasedCourses = await PurchaseCourse.find({status: 'completed'}).populate('courseId');

    if(!purchasedCourses){
        throw new ApiError(404,[],"You have not buyed any courses")
    }
    return res.status(200).json(
        new ApiResponse(200,purchasedCourses,"All purchases courses fetched ")
    )
})