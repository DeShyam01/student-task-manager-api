const express = require("express");
const cors = require("cors");
const db = require("./src/config/db");

const taskRoutes = require("./src/routes/tasksRoutes");
const userRoutes = require("./src/routes/userRoutes");
const activityRoutes = require("./src/routes/activityRoutes");
const requestLogger = require("./src/middleware/requestLogger");
const globalErrorCatcher = require("./src/middleware/globalErrorCatcherMiddleware");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());
app.use(requestLogger);
app.use(globalErrorCatcher);

app.get("/health", (req, res) => {
  try {
    res.status(201).json({ message: "server is running" });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/activity", activityRoutes);

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

db.connectDB();
