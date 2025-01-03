import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const loginUser = async (req, res) => {};

const registerUser = async (req, res) => {
  const { firstName, lastName, mobile } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already registered" });
    }

    // Send OTP for new user
    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({ to: mobile, channel: "sms" });

    // Generate a token with the user details
    const token = jwt.sign(
      { firstName, lastName, mobile },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m", // Token valid for 10 minutes
      }
    );

    res.status(200).json({ message: "OTP sent", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyUser = async (req, res) => {
  const { token, code } = req.body;

  try {
    // Decode the JWT to extract user details
    const { firstName, lastName, mobile } = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Verify the OTP
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({ to: mobile, code });

    if (verificationCheck.status === "approved") {
      // Check if the user already exists
      let user = await User.findOneAndUpdate(
        { mobile },
        { firstName, lastName },
        { new: true, upsert: true } // Create or update the user
      );

      return res
        .status(200)
        .json({ message: "User verified successfully", user });
    }

    res.status(400).json({ message: "Invalid or expired OTP" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired, please register again" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Logout function
const logoutUser = (req, res) => {
  try {
    // clearing cookie
    res.clearCookie("authToken", {
      // httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      // sameSite: "Strict",
    });

    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { loginUser, registerUser, logoutUser };
