import jwt from 'jsonwebtoken';

export const generate_jwt_token = (user, email_id)=>{ 

 const token =  jwt.sign(
 { user_id: user, email: email_id }, // User _id suffix replaced to remove ambiguity :)
    process.env.JWT_SECRET_KEY, // Ensure JWT_SECRET_KEY is correctly set
 { expiresIn: '10s' }
 );
  return token;
};

export const generate_refresh_token = ({user,email_id})=>{
  const refresh_token = jwt.sign(
  { user_id: user, email:email_id }, // same as above :)
      process.env.JWT_SECRET_KEY, //Ensure JWT_SECRET_KEY is correctly set
  { expiresIn:'1d' }
  );
  return refresh_token;
}

