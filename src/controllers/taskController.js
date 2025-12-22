const mongoose = require("mongoose");
const Tasks = require("../models/Tasks");
const Users = require("../models/Users");

const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Tasks.find({ userId: req.user.id });
    res.json(tasks);
  } catch (error) {
    console.log("Error in getAllTasks: ", error.message);
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const task = await Tasks.findById(id);
    if (!task || task.userId != req.user.id) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    console.log("Error in getTaskById: ", error.message);
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, priority } = req.body;
    const userId = req.user.id;

    if (!title || !description || !dueDate || !priority) {
      return res.status(400).json({ message: "all fields are required" });
    }

    const newTask = new Tasks({
      title,
      description,
      dueDate,
      priority,
      userId,
    });
    await newTask.save();

    res.status(201).json(newTask);
  } catch (error) {
    console.log("Error in createTask: ", error);
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const id = req.params.id;

    const updates = {};
    const allowedUpdates = ["title", "description", "dueDate", "priority"];

    allowedUpdates.forEach((update) => {
      if (req.body[update] != null && req.body[update] !== "") {
        updates[update] = req.body[update];
      }
    });

    updates.updatedAt = Date.now();

    const updatedTask = await Tasks.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      updates,
      { new: true, runValidators: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    console.log("Error in updateTask: ", error.message);
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const id = req.params.id;

    const task = await Tasks.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfuly", data: task });
  } catch (error) {
    console.log("error in deleteTask: ", error.message);
    next(error);
  }
};

const markComplete = async (req, res, next) => {
  try {
    const id = req.params.id;

    const task = await Tasks.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { status: "completed" },
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.log("Error in markComplete: ", error.message);
    next(error);
  }
};

const getPendingTasks = async (req, res, next) => {
  try {
    const tasks = await Tasks.find({
      status: "Pending",
      userId: req.user.id,
    }).lean();
    if (!tasks) {
      return res.status(200).json({ message: "No task pending task" });
    }
    return res.status(200).json(tasks);
  } catch (error) {
    console.log("Error in pendingTasks: ", error);
    next(error);
  }
};

const getPriorityTasks = async (req, res, next) => {
  try {
    const tasks = await Tasks.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user.id), status: "Pending", dueDate: { $gte: new Date() } } },
      {
        $addFields: {
          priorityRank: {
            $switch: {
              branches: [
                { case: { $eq: ["$priority", "High"] }, then: 1 },
                { case: { $eq: ["$priority", "Medium"] }, then: 2 },
                { case: { $eq: ["$priority", "Low"] }, then: 3 },
              ],
              default: 4,
            },
          },
        },
      },
      { $sort: { priorityRank: 1, dueDate: 1 } },
      { $project: { priorityRank: 0 } },
    ]);

    if (!tasks || tasks.length === 0) {
      return res.status(200).json({ message: "No tasks found" });
    }

    return res.status(200).json(tasks);
  } catch (error) {
    console.log("Error in getPriorityTasks: ", error);
    next(error);
  }
};

const getDueTasks = async (req, res, next) => {
  try {
    const due = req.query.due;
    let filter = {userId: req.user.id};

    if (due !== "today" && due !== "upcoming" && due !== "overdue") {
      return res.status(400).json({ message: "Invalid due date" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (due === "today") {
      filter.dueDate = { $gte: today, $lt: tomorrow };
      filter.status = "Pending";
    }
    if (due === "upcoming") {
      filter.dueDate = { $gte: tomorrow };
      filter.status = "Pending";
    }
    if (due === "overdue") {
      filter.dueDate = { $lt: today };
      filter.status = "Pending";
    }

    const tasks = await Tasks.find(filter);

    if (!tasks || tasks.length === 0) {
      return res.status(200).json({ message: "No tasks found" });
    }

    res.status(200).json(tasks);
  } catch (error) {
    console.log("Error in getDueTasks: ", error);
    next(error);
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  markComplete,
  getPendingTasks,
  getPriorityTasks,
  getDueTasks,
};
