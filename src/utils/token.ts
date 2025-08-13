import { sign } from 'jsonwebtoken';
import { config } from 'dotenv';
export interface IPayload {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage: string
}
config();
export const generateAndSignToken = (
    payload: IPayload
) => {
    return sign(
        payload,
        process.env.JWT_SECRET as string
    );
}