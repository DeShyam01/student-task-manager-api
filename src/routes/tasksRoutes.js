const express = require("express");
const taskController = require("../controllers/taskController")
const authMiddleware = require("../middleware/authMiddleware")

const {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    markComplete,
    getPendingTasks,
    getPriorityTasks,
    getDueTasks
} = taskController

const router = express.Router()

router.get("/", authMiddleware, getAllTasks);
router.get("/pending", authMiddleware, getPendingTasks);
router.get("/priority", authMiddleware, getPriorityTasks);
router.get("/due", authMiddleware, getDueTasks);
router.get("/:id", authMiddleware, getTaskById);
router.post("/", authMiddleware, createTask);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);
router.patch("/:id/complete", authMiddleware, markComplete);

module.exports = router;