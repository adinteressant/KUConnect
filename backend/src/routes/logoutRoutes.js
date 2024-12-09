import express from "express";
import authenticateJWT from '../middlewares/authenticateJWT.js'
import logoutController  from "../controllers/logoutController.js";

const router = express.Router();

router.get("/api/user-logout",authenticateJWT,logoutController);

export default router;
