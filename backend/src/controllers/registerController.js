
export default async function registerController(req, res) {
  
  const {userId} = req 

  res.status(201).json({
    message: 'User registered successfully',
    user_id: userId, 
  })
}
