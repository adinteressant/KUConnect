import express from 'express';
import registerController from './../controllers/registerController.js';
import registerMiddleware from './../middlewares/registerMiddleware.js';

import { checkSchema } from 'express-validator'
import { registerSchema } from '../utils/validationSchema.js'

import '../strategies/googleStrategy.js'
import passport from 'passport';

  let router = express.Router();

  router.post("/api/user-register/",
    checkSchema(registerSchema)
    ,registerMiddleware,
    registerController);

  
  let frontendPort 
  router.get('/api/auth/google',(req,res,next)=>{
    frontendPort = req.query.port
    next()
  },passport.authenticate('google'))
  
  router.get('/api/google/callback',passport.authenticate('google'),(req,res)=>{
    res.redirect(`http://localhost:${frontendPort}`);  
  })

  router.get('/api/google/status',(req,res) => {
    if(req.user) return res.send(req.user)
    
    return res.status(400).json({msg:'user not authenticated'})
  })
export default router;
