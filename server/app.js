const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/database");

dotenv.config();        // Load .env
connectDB();            // Connect to MongoDB

const app = express();

app.use(express.json());

// Auth routes
app.use("/api/auth", require("./src/routes/authRoutes"));


module.exports = app;