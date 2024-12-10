import express from 'express';
import passport from 'passport';
import { checkSchema } from 'express-validator';
import { registerSchema } from '../utils/validationSchema.js';

import registerController from './../controllers/registerController.js';
import registerMiddleware from './../middlewares/registerMiddleware.js';
import verifyOTP from '../controllers/verifyOTP.js';
import '../strategies/googleStrategy.js';  // Passport Google OAuth Strategy

let router = express.Router();

// Register and OTP Routes
router.post(
  '/api/user-register/',
  checkSchema(registerSchema),
  registerMiddleware,
  registerController
);

router.post('/api/verify-otp/', verifyOTP);

// Google OAuth Routes
let frontendPort;
router.get('/api/auth/google', (req, res, next) => {
  frontendPort = req.query.port;
  next();
}, passport.authenticate('google'));

router.get('/api/google/callback', passport.authenticate('google'), (req, res) => {
  res.redirect(`http://localhost:${frontendPort}`);  // Redirect to frontend
});

router.get('/api/google/status', (req, res) => {
  if (req.user) return res.send(req.user);
  return res.status(400).json({ msg: 'User not authenticated' });
});

router.get('/api/session', (req, res) => {
  console.log('req.session:', req.session); // Logs the entire session object
  console.log('Session ID:', req.session.id); // Logs the session ID directly from req.session

  // Use req.session directly to check if the user is authenticated
  if (req.session && req.session.passport && req.session.passport.user) {
    console.log('Authenticated User:', req.session.passport.user);
    return res.json({ sessionData: req.session });
  } else {
    console.log('No active session or user found');
    return res.status(401).json({ message: 'No active session' });
  }
});

export default router;
