const express = require("express");
const {
  register,
  verifyRegistration,
  login,
  verifyLogin,
} = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/verify-registration", verifyRegistration);
router.post("/login", login);
router.post("/verify-login", verifyLogin);

module.exports = router;
