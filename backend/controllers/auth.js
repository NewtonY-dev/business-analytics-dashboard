import pool from "../db/mysql.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// input validation
function validateSignupInput({ name, email, password }) {
  if (!name || !email || !password) {
    return "name, email and password are required";
  }
  // very simple email check
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return "invalid email";
  }
  if (password.length < 6) {
    return "password must be at least 6 characters";
  }
  return null;
}

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate payload
    const validationError = validateSignupInput({ name, email, password });
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    // Check if user already exists
    const [rows] = await pool.execute("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    // Hash password
    const SALT_ROUNDS = 10;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert user into DB
    const [results] = await pool.execute(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, "user"]
    );

    const payload = { userId: results.insertId, email: email, role: "user" };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });


    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      data: {
        user: {
          id: results.insertId,
          name,
          email,
          role: "user",
        },
      },
    });
  } catch (err) {
    console.error("signup error", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // basic validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });
    }

    // Fetch user by email
    const [rows] = await pool.execute(
      "SELECT id, name, email, password, role FROM users WHERE email = ?",
      [email]
    );
    if (rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const user = rows[0];

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Create JWT payload
    const payload = { userId: user.id, email: user.email, role: user.role };

    // Sign token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Return token and basic user info
    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("login error", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
