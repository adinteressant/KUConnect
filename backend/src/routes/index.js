import { Router } from 'express'

import loginRouter from './loginRoutes.js'
import registerRouter from './registerRoutes.js' 
import userRouter from './userRoutes.js'  
import logoutRouter from './logoutRoutes.js'
import postRouter from './postRoutes.js'
import likeRouter from './likeRoutes.js'
import commentRouter from './commentRoutes.js'
import savePostRouter from './savePostRoutes.js'
import userChangeRoute from '../routes/userChangeRoute.js'
import getPictureRouter from '../routes/getPictureRoutes.js'
import updatePictureRouter from '../routes/updatePictureRouter.js'
import profileRouter from '../routes/profileRoute.js'
import messageRouter from '../routes/messageRoutes.js'
import friendRouter from '../routes/friendRoutes.js'
import getEmbedRouter from '../routes/embeds.js'
import deleteAccountRouter from '../routes/deleteAccountRoutes.js'

const router = Router()

router.use(getEmbedRouter)
router.use(loginRouter)
router.use(registerRouter)
router.use(userRouter)
router.use(logoutRouter)
router.use(postRouter)
router.use(likeRouter)
router.use(commentRouter)
router.use(savePostRouter)
router.use(userChangeRoute)
router.use(getPictureRouter)
router.use(updatePictureRouter)
router.use(profileRouter)
router.use(messageRouter)
router.use(friendRouter)
router.use(deleteAccountRouter)

export default router
