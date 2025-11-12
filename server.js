const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.js");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "QuickDB Authentication API is running!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});