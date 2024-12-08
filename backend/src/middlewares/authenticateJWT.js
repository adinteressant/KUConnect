import jwt from "jsonwebtoken";
import { generate_jwt_token } from "../utils/generateJwtToken.js";

const authenticateJWT = async (req, res, next) => {
  try {
    //const authHeader = req.headers.authorization;
 
    const refresh_token = req.cookies.REFRESH_TOKEN;

    const token = req.cookies.JWT_TOKEN; 
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Invalid token!" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        // Handle token expiration
        if (err.name === "TokenExpiredError") {
          // Verify the refresh token
          jwt.verify(refresh_token, process.env.JWT_SECRET_KEY, (refreshErr) => {
            if (!refreshErr) {
              // Decode the expired token and generate a new one
              const decoded_jwt = jwt.decode(token);
              req.user = decoded_jwt.user_id;

              const newToken = generate_jwt_token(decoded_jwt.user_id,decoded_jwt.email);
              res.clearCookie("JWT_TOKEN");
              res.cookie("JWT_TOKEN", newToken, {
                httpOnly: true,
                secure: false,
              });
              console.log("Token Refreshed!");
              return next();
            } else {
              
              res.clearCookie("JWT_TOKEN");
              return res.status(401).json({
                message: "Unauthorized: Refresh token invalid!",
                error: refreshErr,
              });
            }
          });
        } else {

          res.clearCookie("JWT_TOKEN");
          return res.status(401).json({
            message: "Unauthorized: Invalid token!",
            error: err,
          });
        }
      } else {
        // Token is valid
        req.user = decoded.user_id;
        next();
      }
    });
  } catch (error) {
    console.error("JWT authentication error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export default authenticateJWT;
