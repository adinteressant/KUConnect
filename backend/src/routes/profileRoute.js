import { Router } from 'express'

const router = Router()

import getProfileMiddleware from '../middlewares/getProfileMiddleware.js'
import getProfileController from '../controllers/getProfileController.js'

router.get('/api/get-profile',getProfileMiddleware,getProfileController)

export default router