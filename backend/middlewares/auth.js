import jwt from "jsonwebtoken";

function authenticateToken(req, res, next) {
  try {
    const authHeader =
      req.headers["authorization"] || req.headers["Authorization"];
    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: "Missing Authorization header" });
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        success: false,
        message: "Malformed Authorization header. Use: Bearer <token>",
      });
    }

    const token = parts[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Token not provided" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET not set in environment");
      return res
        .status(500)
        .json({ success: false, message: "Server configuration error" });
    }

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ success: false, message: "Invalid or expired token" });
      }

      // decoded is the payload used when signing the token 
      req.user = decoded;
      return next();
    });
  } catch (err) {
    console.error("authenticateToken error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error in authentication" });
  }
}

export default authenticateToken;
