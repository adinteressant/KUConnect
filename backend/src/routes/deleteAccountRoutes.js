import { Router } from 'express'
import {confirmPassword,deleteAccount} from '../controllers/deleteAccountController.js'
import authenticateJWT from '../middlewares/authenticateJWT.js'
const router = Router()

router.post('/api/delete/confirm-password',confirmPassword)

router.post('/api/delete-account', authenticateJWT, deleteAccount)

export default router
