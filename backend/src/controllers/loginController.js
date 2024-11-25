const loginController = ((req,res) =>{
  console.log(req.body);
  res.status(201).json({"Login":"Successful"}) 
});

export default loginController;
