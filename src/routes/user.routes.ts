import { Router } from "express";
import { logoutUser, signInUser, signUpUser, updateUser, verifyUser } from "../controllers/user.controllers";
const router = Router();
router.post('/signup', signUpUser);
router.post('/signin', signInUser);
router.post('/verify', verifyUser);
router.patch('/update', updateUser);
router.get('/logout', logoutUser);
export default router;