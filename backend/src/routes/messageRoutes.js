import { Router } from 'express'
import { changeStatus, getStatus, sendMessageController } from '../controllers/messageController.js'
import { messageMiddleware } from '../middlewares/messageMiddleware.js'
import authenticateJWT from '../middlewares/authenticateJWT.js'
import { getMessageController } from '../controllers/messageController.js'

const router = Router()

router.post('/api/message/send/:receiverId',authenticateJWT,messageMiddleware,sendMessageController)

router.get('/api/message/:receiverId',authenticateJWT,messageMiddleware,getMessageController)

router.patch('/api/change-message-status/:receiverId',authenticateJWT,messageMiddleware,changeStatus)

router.get('/api/get-message-status',authenticateJWT,messageMiddleware,getStatus)

export default router