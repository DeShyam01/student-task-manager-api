const express = require("express");
const db = require("./src/config/db");
const taskRoutes = require("./src/routes/tasksRoutes");
const userRoutes = require("./src/routes/userRoutes");
const requestLogger = require("./src/middleware/requestLogger");
const globalErrorCatcher = require("./src/middleware/globalErrorCatcherMiddleware");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials: true,
  }
));
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

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

db.connectDB();
