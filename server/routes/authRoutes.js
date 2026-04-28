import { Router } from "express";
import { register, login, verifyLoginOTP, resendOTP, updateProfile, registerVolunteer } from "../controllers/authController.js";
import authMiddleware from "../middleware/auth.js";

const router = Router()

router.post('/register', register)
router.post('/register-volunteer', registerVolunteer)
router.post('/login', login)
router.post('/verify-otp', verifyLoginOTP)
router.post('/resend-otp', resendOTP)
router.put('/profile', authMiddleware, updateProfile)

export default router