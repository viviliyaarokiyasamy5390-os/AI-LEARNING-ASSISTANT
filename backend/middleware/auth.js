import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;

  // 1. Header-la irundhu token-a eduka
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2. Token illana return
  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Not authorized, no token",
      statusCode: 401,
    });
  }

  // 3. Token-a verify panni user-a edukkuradhu
  try {
    // JWT_SECRET irukka nu check pannikalam
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in.env file");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Token-la id irukka nu check pannradhu safe
    if (!decoded.id) {
      return res.status(401).json({
        success: false,
        error: "Not authorized, invalid token payload",
        statusCode: 401,
      });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User not found",
        statusCode: 401,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Token has expired",
        statusCode: 401,
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: "Not authorized, invalid token",
        statusCode: 401,
      });
    }

    return res.status(401).json({
      success: false,
      error: "Not authorized, token failed",
      statusCode: 401,
    });
  }
};

export default protect;