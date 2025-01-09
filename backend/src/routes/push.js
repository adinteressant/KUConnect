import { Router } from 'express';
const router = Router();
import authenticateJWT from './../middlewares/authenticateJWT.js';
import webPushSubscriptionController from '../controllers/webPushSubscriptionController.js';
import sendNotificationController from '../controllers/sendNotificationController.js';

// Add error handling middleware
const errorHandler = (controller) => async (req, res, next) => {
  try {
    await controller(req, res, next);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

router.post('/api/subscribe', authenticateJWT, errorHandler(webPushSubscriptionController));
router.post('/api/send-notification', errorHandler(sendNotificationController));

export default router;
