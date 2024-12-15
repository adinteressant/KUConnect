import { Router } from 'express'
import { messageController } from '../controllers/messageController.js'
import { messageMiddleware } from '../middlewares/messageMiddleware.js'
import authenticateJWT from '../middlewares/authenticateJWT.js'

const router = Router()

router.post('/api/message/send/:receiverId',authenticateJWT,messageMiddleware,messageController)

export default router