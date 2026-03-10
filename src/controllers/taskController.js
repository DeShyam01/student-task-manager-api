const Tasks = require("../models/Tasks");
const {createActivity} = require("./activityController");

const getAllTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { status, priority, due, sort } = req.query;

    let filter = { userId };

    if (status) {
      filter.status = status;
    }

    if (priority) {
      if (priority == "High") {
        filter.priority = 1;
      } else if (priority == "Medium") {
        filter.priority = 2;
      } else if (priority == "Low") {
        filter.priority = 3;
      }
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (due === "today") {
      filter.dueDate = { $gte: today, $lt: tomorrow };
    }
    if (due === "upcoming") {
      filter.dueDate = { $gte: tomorrow };
    }
    if (due === "overdue") {
      filter.dueDate = { $lt: today };
    }

    let sortOption = {};
    if (sort === "dueDate") {
      sortOption.dueDate = 1;
    } else if (sort === "priority") {
      sortOption.priority = 1;
    }

    const tasks = await Tasks.find(filter).sort(sortOption);

    if (!tasks) {
      return res.status(200).json({ message: "No tasks found" });
    }

    res.status(200).json(tasks);
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

    await createActivity({userId, type: "create", message: `Created ${newTask.title}`, taskId: newTask._id});

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

    await createActivity({userId, type: "update", message: `Updated ${updatedTask.title}`, taskId: updatedTask._id});

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

    await createActivity({userId, type: "delete", message: `Deleted ${task.title}`, taskId: task._id});

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

    await createActivity({userId, type: "complete", message: `Completed ${task.title}`, taskId: task._id});

    res.status(200).json(task);
  } catch (error) {
    console.log("Error in markComplete: ", error.message);
    next(error);
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  markComplete
};
