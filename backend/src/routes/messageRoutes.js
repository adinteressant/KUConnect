import { Router } from 'express'
import { changeStatus, deleteMessageController, editMessageController, getConversations, getStatus, sendMessageController } from '../controllers/messageController.js'
import { messageMiddleware } from '../middlewares/messageMiddleware.js'
import authenticateJWT from '../middlewares/authenticateJWT.js'
import { getMessageController } from '../controllers/messageController.js'
import { updateCallIdController,getCallIdController } from '../controllers/messageController.js'
const router = Router()

router.get('/api/conversations',getConversations)

router.post('/api/message/send/:receiverId',authenticateJWT,messageMiddleware,sendMessageController)

router.get('/api/message/:receiverId',authenticateJWT,messageMiddleware,getMessageController)

router.patch('/api/change-message-status/:receiverId',authenticateJWT,messageMiddleware,changeStatus)

router.get('/api/get-message-status',authenticateJWT,messageMiddleware,getStatus)

router.delete('/api/delete-message',authenticateJWT,messageMiddleware,deleteMessageController)

router.patch('/api/edit-message',authenticateJWT,messageMiddleware,editMessageController)

router.post('/api/message/update-call-id',updateCallIdController)

router.post('/api/message/get-call-id',getCallIdController)

export default router
