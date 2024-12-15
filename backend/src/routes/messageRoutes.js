import { Router } from 'express'
import { sendMessageController } from '../controllers/messageController.js'
import { messageMiddleware } from '../middlewares/messageMiddleware.js'
import authenticateJWT from '../middlewares/authenticateJWT.js'
import { getMessageController } from '../controllers/messageController.js'
import { getUsersWithMessageController } from '../controllers/messageController.js'

const router = Router()

router.post('/api/message/send/:receiverId',authenticateJWT,messageMiddleware,sendMessageController)

router.get('/api/message/:receiverId',authenticateJWT,messageMiddleware,getMessageController)

router.get('/api/users-message',authenticateJWT,messageMiddleware,getUsersWithMessageController)

export default router