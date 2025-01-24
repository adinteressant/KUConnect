import express from 'express';
import registerController from './../controllers/registerController.js';
import registerMiddleware from './../middlewares/registerMiddleware.js';

import { checkSchema } from 'express-validator'
import { registerSchema } from '../utils/validationSchema.js'

import '../strategies/googleStrategy.js'
import passport from 'passport'
import verifyOTP from '../controllers/verifyOTP.js'
import PrivateInfo from '../models/PrivateInfo.js'
import { setUserInfo } from '../controllers/setUserInfo.js'

  let router = express.Router();

  router.post("/api/user-register/",
    checkSchema(registerSchema)
    ,registerMiddleware,
    registerController);


  router.post('/api/verify-otp/',verifyOTP)

  router.post('/api/set-user-info',setUserInfo)

  

  //google authorization
  let frontendPort 
  router.get('/api/auth/google',(req,res,next)=>{
    frontendPort = req.query.port
    next()
  },passport.authenticate('google',{failureRedirect:`https://localhost:${frontendPort}/login`}))
  
router.get('/api/google/callback',passport.authenticate('google',{
  failureRedirect:`https://localhost:${frontendPort}/login`,
  failureFlash: true,
}),
    async (req,res)=>{
    const {user:{email}} = req

    const privateProfile = await PrivateInfo.findOne({email:email});
    if(!privateProfile){
      return res.redirect(`https://localhost:${frontendPort}/set-google-profile?email=${email}`)
    }

    return res.redirect(`https://localhost:${frontendPort}/home`);  
  }
)

  router.get('/api/google/status',(req,res) => {
    if(req.user) return res.send(req.user)
    
    return res.status(400).json({msg:'user not authenticated'})
  })
export default router;
