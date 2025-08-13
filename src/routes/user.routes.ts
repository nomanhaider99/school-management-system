import { Router, Request, Response, NextFunction } from "express";
import { signInUser, signUpUser, updateUser, verifyUser } from "../controllers/user.controllers";
const router = Router();
router.post('/signup', signUpUser);
router.post('/verify', verifyUser);
// router.post('/signin', signInUser);
// router.patch('/update', updateUser);
export default router;