import { matchedData, validationResult } from "express-validator";

export default function registerMiddleware(req,res,next){
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({error:errors.array()});
  } 
  const data = matchedData(req)
  console.log(data) // 'data' now is ready to be stored in database
  next();
}


  