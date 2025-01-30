import { Router } from 'express'
import deleteAccountController from '../controllers/deleteAccountController.js'
import authenticateJWT from '../middlewares/authenticateJWT.js'
const router = Router()

router.post('/api/delete-account', authenticateJWT, deleteAccountController)

export default router
