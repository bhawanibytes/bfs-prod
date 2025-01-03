require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");

const app = express();
connectDB();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("testing");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
