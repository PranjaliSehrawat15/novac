const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/database");

dotenv.config();        // Load .env
connectDB();            // Connect to MongoDB

const app = express();

app.use(express.json());

// Auth routes
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/users", require("./src/routes/userRoutes"));
app.use("/api/leads", require("./src/routes/leadRouter"));
app.use("/api/deals",  require("./src/routes/dealRoutes"));
app.use("/api/activities", require("./src/routes/activityRoutes"));

module.exports = app;