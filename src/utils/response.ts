import { NextFunction, Response } from "express";
import createHttpError from "http-errors";

export function SuccessResponse (
    statusCode: number,
    message: string,
    data: unknown,
    res: Response
) {
    return res.status(statusCode).json(
        {
            message: message,
            data: data
        }
    );
}

export function ErrorResponse (
    statusCode: number,
    message: string,
    next: NextFunction
) {
    return next(createHttpError(statusCode));
}