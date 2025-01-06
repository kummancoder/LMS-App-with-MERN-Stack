import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import 
import userRouter from "./routes/user.routes.js";

// routes declaration
app.use("/api/v1/user",userRouter)

// http://localhost:8000/api/v1/users/register
export { app };
