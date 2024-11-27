import { validationResult } from 'express-validator'

export default function registerController(req,res){
  //To implment implementing the addition of user data into database
  const result = validationResult(req)
  console.log(result) //well it works
  res.send({
    "status":"Success"
  })
}
