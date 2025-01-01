import express from 'express';
import getPictureController from '../controllers/getPictureController.js';

const router = express.Router();

router.get("/api/get-pfp/",getPictureController);

export default router;
