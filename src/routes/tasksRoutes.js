const express = require("express");
const taskController = require("../controllers/taskController")


const {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    markComplete,
    getPendingTasks,
    getPriorityTasks,
} = taskController

const router = express.Router()

router.get("/", getAllTasks);
router.get("/pending", getPendingTasks);
router.get("/priority", getPriorityTasks);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.patch("/:id/complete", markComplete);

module.exports = router;