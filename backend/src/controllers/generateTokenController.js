// import { verify } from "jsonwebtoken";
import { generate_jwt_token } from "../utils/generateJwtToken.js";

export default function generateTokenController(req, res) {
  try {
    const { user, email } = req.body;

    // Validate inputs
    if (!user || !email) {
      return res.status(400).json({ message: "User and email are required." });
    }

    // Generate tokens
    let token = generate_jwt_token({ user, email });
    let refresh_token = req.cookies.REFRESH_TOKEN;

    // Set cookies
    res.cookie("JWT_TOKEN", token, { httpOnly: true, secure: true });
    res.cookie("REFRESH_TOKEN", refresh_token, { httpOnly: true, secure: true });

    res.status(200).json({ message: "Tokens generated successfully." });
  } catch (err) {
    console.error("Error in generateTokenController:", err.message);
    res.status(500).json({ message: "Internal Server Error!", error: err.message });
  }
}
