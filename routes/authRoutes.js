const express = require("express");
const {
  register,
  verifyRegister,
  login,
  verifyLogin,
} = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/verify-register", verifyRegister);
router.post("/login", login);
router.post("/verify-login", verifyLogin);

module.exports = router;
