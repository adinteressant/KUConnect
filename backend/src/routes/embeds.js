import { Router } from 'express'
import getEmbedController from '../controllers/getEmbedController.js'
const router = Router()

router.post('/api/get-embed',getEmbedController)

export default router
