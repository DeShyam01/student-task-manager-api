const express = require("express");
const { getAllTasks, getTaskById, createTask, updateTask, deleteTask, markComplete } = require("../controllers/taskController")
const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router()

router.get("/", authMiddleware, getAllTasks)
router.get("/:id", authMiddleware, getTaskById)
router.post("/", authMiddleware, createTask)
router.put("/:id", authMiddleware, updateTask)
router.delete("/:id", authMiddleware, deleteTask)
router.patch("/:id/complete", authMiddleware, markComplete)

module.exports = router