import { validationResult } from 'express-validator'

export default function registerController(req,res){
  //To implment implementing the addition of user data into database
  res.send({
    "status":"Success registering"
  })
}
