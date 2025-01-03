const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");

module.exports = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).send({ message: "Invalid token" });
  }
};
