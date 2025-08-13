import { config } from 'dotenv'
import { transporter } from '../config/nodemailer'
config();
export const sendEmail = async (
    to: string,
    subject: string,
    text: string,
    otp: number
) => {
    try {
        return await transporter.sendMail(
            {
                from: process.env.AUTH_USER,
                to: to,
                subject: subject,
                text: text,
                html: `
                <!DOCTYPE html>
                <html>
                <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap" rel="stylesheet">
                <title>OTP Verification</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap');
                    html, body {
                        font-family: "Bricolage Grotesque", sans-serif;
                        font-optical-sizing: auto;
                        background-color: #f9f9f9;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 500px;
                        margin: auto;
                        background-color: #ffffff;
                        border-radius: 8px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                        padding: 20px;
                    }
                    h1 {
                        color: #333333;
                        text-align: center;
                    }
                    p {
                        color: #555555;
                        font-size: 16px;
                        line-height: 1.5;
                        text-align: center;
                    }
                    .otp-box {
                        text-align: center;
                        background-color: #007acc;
                        color: white;
                        font-size: 24px;
                        font-weight: bold;
                        letter-spacing: 6px;
                        padding: 15px;
                        margin: 20px 0;
                        border-radius: 6px;
                    }
                    .footer {
                        text-align: center;
                        color: #888888;
                        font-size: 12px;
                        margin-top: 20px;
                    }
                    @media (max-width: 600px) {
                        .otp-box {
                            font-size: 20px;
                            letter-spacing: 4px;
                        }
                    }
                </style>
                </head>
                <body>
                <div class="container">
                    <h1>Email Verification</h1>
                    <p>Use the following One-Time Password (OTP) to complete your verification process.</p>
                    <div class="otp-box">${otp}</div>
                    <p>This code will expire in <strong>10 minutes</strong>.</p>
                    <p>If you did not request this, please ignore this email.</p>
                    <div class="footer">
                    &copy; 2025 Your Company. All rights reserved.
                    </div>
                </div>
                </body>
            </html>
        `
            }
        )
    } catch (error: any) {
        throw new Error(error.message);
    }
}