const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// ✅ FIXED: dotenv must load BEFORE anything uses process.env
dotenv.config();

// ✅ FIXED: app must be created BEFORE app.use() is called
const app = express();

// ✅ FIXED: cors middleware applied after app is defined
// app.use(
//   cors({
//     origin: ["http://localhost:3000"],
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      process.env.FRONTEND_URL || "https://your-app.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth",       require("./src/routes/authRoutes"));
app.use("/api/users",      require("./src/routes/userRoutes"));
app.use("/api/leads",      require("./src/routes/leadRouter"));
app.use("/api/deals",      require("./src/routes/dealRoutes"));
app.use("/api/activities", require("./src/routes/activityRoutes"));
app.use("/api/notes",      require("./src/routes/noteRoutes"));
app.use("/api/stages",     require("./src/routes/stageRoutes"));
app.use("/api/dashboard",  require("./src/routes/dashboardRoutes"));
app.use("/api/ai",         require("./src/routes/aiRoutes"));

module.exports = app;
