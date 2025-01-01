import passport from 'passport'
import { Strategy } from 'passport-google-oauth2'
import { GoogleUser } from '../models/googleUser.model.js'
import { KU_DOMAIN } from '../constants.js'

passport.serializeUser((user,done) => {
  // console.log('inside serializeUser')
  // console.log(user)
  done(null,user.id)
})

passport.deserializeUser( async (userId,done) => {
  try{
    const findUser = await GoogleUser.findById(userId)
    // console.log('inside deserialize user')
    // console.log(findUser)
    return findUser ? done(null,findUser) : done(null,null)
  }catch(e){
    done(e,null)
  }
})

export default passport.use(new Strategy({
  clientID:     process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: `http://localhost:${process.env.PORT}/api/google/callback`,
  scope:['email'],
  passReqToCallback   : true
},
  async (req,accessToken, refreshToken, profile, done) => {
    const gmail = profile.email
    if(!gmail.includes(KU_DOMAIN)){
      return done('Email address should contain KU-domain.',null)
    }
    let findUser
    try{
      findUser = await GoogleUser.findOne({googleId:profile.id})
    }catch(e){
      console.log(e)
      return done(e,null)
    }
    try{
      if(!findUser){
        const newUser = new GoogleUser({
          email:profile.email,
          googleId:profile.id
        })
        const newSavedUser = await newUser.save()
        return done(null,newSavedUser)
      }
      // console.log('user google info in the req handler:')
      // console.log(findUser)
      return done(null,findUser)
    }catch(e){
      console.log(e)
      return done(e,null)
    }
    
  }
));
