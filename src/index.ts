import express from 'express';
import { config } from 'dotenv';
import userRoutes from './routes/user.routes';
import cookieParser from 'cookie-parser';
import { connectDatabase } from './config/database';
const app = express();
config();
connectDatabase();
app.use(cookieParser());
app.use(express.json());
app.use('/api/v1/users', userRoutes);
app.listen(process.env.PORT!, () => {
    console.log(`🕸️| Server is Listening on Port ${process.env.PORT!}`);
});