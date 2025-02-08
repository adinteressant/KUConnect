import jwt from "jsonwebtoken";

export const checkAuth = async (req, res) => {
    try {
        const token = req.cookies.JWT_TOKEN; 
  
        if (!token) {
        res.status(401).json({ authenticated: false, message: "No token provided" });
        }
  
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        res.status(201).json({ authenticated: true, user: decoded });
    } catch (error) {
        console.error("JWT verification failed:", error);
        res.status(401).json({ authenticated: false, message: "Invalid or expired token" });
    }
};
