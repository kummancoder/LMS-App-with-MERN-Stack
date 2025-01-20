import { ApiError } from '../utils/ApiError.js';

const errorHandler = (err, _, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
            stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
        });
    }

    console.error(err);
    res.status(500).json({
        success: false,
        message: "Internal Server Error",
        errors: [],
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
};

export { errorHandler };