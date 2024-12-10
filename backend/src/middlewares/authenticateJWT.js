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
          if (!refresh_token) {
            return res.status(401).json({ message: "Unauthorized: Missing refresh token!" });
          }

          jwt.verify(refresh_token, process.env.JWT_SECRET_KEY, async (refreshErr, refreshDecoded) => {
            if (refreshErr) {
              res.clearCookie("JWT_TOKEN");
              return res.status(401).json({
                message: "Unauthorized: Refresh token invalid!",
                error: refreshErr,
              });
            }

            const newToken = generate_jwt_token(refreshDecoded.user_id, refreshDecoded.email);

            res.clearCookie("JWT_TOKEN");
            res.cookie("JWT_TOKEN", newToken, {
              httpOnly: true,
              secure: false,
            });

            console.log('User from refresh token:', refreshDecoded);

            req.user = {
              user_id: refreshDecoded.user_id,
              username: refreshDecoded.username,
              email: refreshDecoded.email,
            };

            console.log('User set in request:', req.user);  // Log the user
            return next();
          });
        } else {

          res.clearCookie("JWT_TOKEN");
          return res.status(401).json({
            message: "Unauthorized: Invalid token!",
            error: err,
          });
        }
      } else {
        req.user = {
          user_id: decoded.user_id,
          username: decoded.username,
          email: decoded.email,
        };
        console.log('User set in request:', req.user);  // Log the user
        return next();
      }
    });
  } catch (error) {
    console.error("JWT authentication error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export default authenticateJWT;