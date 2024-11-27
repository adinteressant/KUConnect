import { Router } from 'express'

import loginRouter from './loginRoutes.js'
import registerRouter from './registerRoutes.js' 

const router = Router()

router.use(loginRouter)
router.use(registerRouter)

export default router