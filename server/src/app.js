import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.routes.js";
import courseRouter from "./routes/course.routes.js";
import mediaRoute from "./routes/media.routes.js";
import purchaseRoute from "./routes/purchaseCourse.routes.js";
import courseProgressRoute from "./routes/courseprogress.routes.js";

// routes declaration
app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", courseProgressRoute);

// http://localhost:8000/api/v1/users/register
app.use(errorHandler);
export { app };
