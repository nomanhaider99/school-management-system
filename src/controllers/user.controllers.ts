import { NextFunction, Request, Response } from "express"
import { User } from "../models/user.models"
import { ErrorResponse, SuccessResponse } from "../utils/response"
import bcrypt from "bcryptjs"
import { generateAndSignToken, IPayload } from "../utils/token";
import { sendEmail } from '../utils/email'
import { verify } from "jsonwebtoken";
import { Role, StatusCode } from '../utils/variables'

export const signUpUser = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const { firstName, lastName, email, password, role } = await request.body;
    try {
        if (!firstName || !lastName || !email || !password || !role) {
            ErrorResponse(
                StatusCode.BAD_REQUEST,
                'invalid data!',
                next
            );
            return;
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            ErrorResponse(
                StatusCode.FORBIDDEN,
                'user already exists!',
                next
            );
            return;
        }
        const salt = await bcrypt.genSalt(15);
        const hashedPassword = await bcrypt.hash(password, salt);
        const createdUser = await User.create(
            {
                firstName,
                lastName,
                email,
                role,
                password: hashedPassword,
            }
        );
        const OTP = Math.floor(100000 + Math.random() * 900000);
        const emailResponse = await sendEmail(
            createdUser.email,
            'Verify Your Account',
            'Copy/Paste Your OTP to the form to complete your account verification.',
            OTP
        )
        if (!emailResponse) {
            ErrorResponse(
                StatusCode.INTERNAL_SERVER_ERROR,
                'failed to send email!',
                next
            );
            return;
        } else {
            const tenMinutes = new Date(Date.now() + 10 * 60 * 1000);
            await createdUser.updateOne({
                otp: OTP,
                otpExpires: tenMinutes
            });
            SuccessResponse(
                StatusCode.OK,
                'user created, please verify your account!',
                createdUser,
                response
            );
            return;
        }
    } catch (error: any) {
        ErrorResponse(
            StatusCode.INTERNAL_SERVER_ERROR,
            error.message,
            next
        )
        return;
    }
}
export const signInUser = async (
    data: {
        email: string,
        password: string
    },
    response: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = data;
        if (!email || !password) {
            return ErrorResponse(
                StatusCode.BAD_REQUEST,
                'invalid data!',
                next
            );
        }
        const userExists = await User.findOne({ email });
        if (!userExists) {
            return ErrorResponse(
                StatusCode.NOT_FOUND,
                'user not found!',
                next
            );
        }

        const passwordCorrect = await bcrypt.compare(password, userExists.password);

        if (!passwordCorrect) {
            return ErrorResponse(
                StatusCode.UNAUTHORIZED,
                'email or password incorrect!',
                next
            );
        }

        const isVerified = userExists.verified;
        if (!isVerified) {
            const OTP = Math.floor(100000 + Math.random() * 900000);
            const emailResponse = await sendEmail(
                userExists.email,
                'Verify Your Account',
                'Copy/Paste Your OTP to the form to complete your account verification.',
                OTP
            )

            if (!emailResponse) {
                return ErrorResponse(
                    StatusCode.INTERNAL_SERVER_ERROR,
                    'failed to send email!',
                    next
                );
            } else {
                const tenMinutes = new Date(Date.now() + 10 * 60 * 1000);
                await userExists.updateOne({
                    otp: OTP,
                    otpExpires: tenMinutes
                });
                return SuccessResponse(
                    StatusCode.OK,
                    'verification email sent!',
                    null,
                    response
                );
            }
        } else {
            const payload: IPayload = {
                _id: userExists._id as string,
                firstName: userExists.firstName,
                lastName: userExists.lastName,
                email: userExists.email,
                profileImage: userExists.profileImage as string
            }
            const token = generateAndSignToken(payload);
            const accessToken = response.cookie('access-token', token, {
                httpOnly: true,
                path: '/',
                secure: true,
                sameSite: 'none'
            });
            await userExists.updateOne({
                refreshToken: token
            });
            return SuccessResponse(
                StatusCode.OK,
                'user loggedin!',
                accessToken,
                response
            );
        }

    } catch (error: any) {
        return ErrorResponse(
            StatusCode.INTERNAL_SERVER_ERROR,
            error.message,
            next
        )
    }
}
export const verifyUser = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        if (!request.body) {
            ErrorResponse(
                StatusCode.BAD_REQUEST,
                'invalid body',
                next
            );
            return;
        }
        const { otp } = await request.body;
        if (!otp) {
            ErrorResponse(
                StatusCode.BAD_REQUEST,
                'invalid otp!',
                next
            );
            return;
        }
        const user = await User.findOne({ otp });
        if (!user) {
            ErrorResponse(
                StatusCode.UNAUTHORIZED,
                'incorrect otp!',
                next
            );
            return;
        }
        if (Number(user.otpExpires) < Number(Date.now())) {
            ErrorResponse(
                StatusCode.GONE,
                'otp has expired!',
                next
            );
            return;
        }
        SuccessResponse(
            StatusCode.OK,
            'account verified!',
            null,
            response
        );
        return;
    } catch (error: any) {
        return ErrorResponse(
            StatusCode.INTERNAL_SERVER_ERROR,
            error.message,
            next
        )
    }
}
export const updateUser = async (
    data: {
        phone: string,
        address: string,
        dateOfBirth: Date,
        gender: "male" | "female",
        profileImage: string
    },
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const { phone, address, dateOfBirth, gender, profileImage } = data;
    try {
        if (!phone || !address || !dateOfBirth || !gender || !profileImage) {
            return ErrorResponse(
                StatusCode.BAD_REQUEST,
                'invalid data',
                next
            );
        }
        const accessToken = request.cookies['access-token'];
        if (!accessToken) {
            return ErrorResponse(
                StatusCode.UNAUTHORIZED,
                'user not loggedin!',
                next
            )
        }
        const decodedToken = verify(accessToken, process.env.JWT_SECRET as string);
        if (typeof decodedToken == 'object') {
            const data: IPayload = {
                _id: decodedToken._id,
                email: decodedToken.email,
                firstName: decodedToken.firstName,
                lastName: decodedToken.lastName,
                profileImage: decodedToken.profileImage
            };

            const user = await User.findOne({ email: data.email });
            if (!user) {
                return ErrorResponse(
                    StatusCode.NOT_FOUND,
                    'user not found!',
                    next
                )
            }
            const updatedUser = await user.updateOne(
                {
                    phone,
                    address,
                    dateOfBirth,
                    gender,
                    profileImage
                }
            );
            return SuccessResponse(
                StatusCode.OK,
                'user updated!',
                user,
                response
            );
        }
    } catch (error: any) {
        return ErrorResponse(
            StatusCode.INTERNAL_SERVER_ERROR,
            error.message,
            next
        )
    }
}
export const logoutUser = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const accessToken = request.cookies['access-token'];

        if (!accessToken) {
            return ErrorResponse(
                StatusCode.BAD_REQUEST,
                'token not found!',
                next
            );
        }
        const user = await User.findOne({ refreshToken: accessToken });
        if (!user) {
            return ErrorResponse(
                StatusCode.NOT_FOUND,
                'user not found!',
                next
            );
        }
        await user.updateOne({ refreshToken: null });
        response.clearCookie('access-token', {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: 'none'
        });
        return SuccessResponse(
            StatusCode.OK,
            'user logged out!',
            null,
            response
        );
    } catch (error: any) {
        return ErrorResponse(
            StatusCode.INTERNAL_SERVER_ERROR,
            error.message,
            next
        );
    }
}