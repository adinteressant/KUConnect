import { validationResult } from "express-validator";

export default function registerMiddleware(req,res,next){
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({error:errors.array()});
  } 
  // console.log(req.body);  test looks cute might delete later :)
  next();
}


