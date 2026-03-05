const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());

// Routes
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/users", require("./src/routes/userRoutes"));
app.use("/api/leads", require("./src/routes/leadRouter"));
app.use("/api/deals", require("./src/routes/dealRoutes"));
app.use("/api/activities", require("./src/routes/activityRoutes"));
app.use("/api/notes", require("./src/routes/noteRoutes"));
app.use("/api/stages", require("./src/routes/stageRoutes"));
app.use("/api/dashboard", require("./src/routes/dashboardRoutes"));

module.exports = app;