const User = require("../models/User");
const client = require("../config/twilio");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { firstName, lastName, mobile } = req.body;
  try {
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already registered" });
    }

    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({ to: mobile, channel: "sms" });

    const token = jwt.sign(
      { firstName, lastName, mobile },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m",
      }
    );

    res.status(200).json({ message: "OTP sent for registration", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// OTP verification and user creation logic here
exports.verifyRegister = async (req, res) => {
  const { token, otp } = req.body;
  try {
    // Decode the JWT to extract user details
    const { firstName, lastName, mobile } = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Verify the OTP
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({ to: mobile, code: otp });

    if (verificationCheck.status === "approved") {
      const newUser = new User({
        firstName,
        lastName,
        mobile,
      });
      await newUser.save();

      return res
        .status(200)
        .json({ message: "User verified and registered", newUser });
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

// Login logic here
exports.login = async (req, res) => {
  const { mobile } = req.body;
  try {
    const user = await User.findOne({ mobile });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found. Please register first." });
    }

    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({ to: mobile, channel: "sms" });

    res.status(200).json({ message: "OTP sent for login" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyLogin = async (req, res) => {
  const { mobile, otp } = req.body;
  try {
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({ to: mobile, code: otp });

    if (verificationCheck.status === "approved") {
      const jwtToken = jwt.sign({ mobile }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return res
        .status(200)
        .json({ message: "Login successful", token: jwtToken });
    }

    res.status(400).json({ message: "Invalid or expired OTP" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
