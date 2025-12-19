const Tasks = require("../models/Tasks");

const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Tasks.find();
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
    if (!task) {
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

    if (!title || !description || !dueDate || !priority) {
      return res.status(400).json({ message: "all fields are required" });
    }

    const newTask = new Tasks({ title, description, dueDate, priority });
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

    const { title, description, dueDate, priority } = req.body;
    if (!title || !description || !dueDate || !priority) {
      return res.status(400).json({ message: "all fields are required" });
    }

    const updatedTask = await Tasks.findByIdAndUpdate(
      id,
      {
        title,
        description,
        dueDate,
        priority,
      },
      { new: true }
    );
    await updatedTask.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    console.log("Error in updateTask: ", error.message);
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const id = req.params.id;

    const task = await Tasks.findByIdAndDelete(id);
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

    const task = await Tasks.findByIdAndUpdate(
      id,
      { status: "completed" },
      { new: true }
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
        const tasks = await Tasks.find({status: "Pending"}).lean();
        if(!tasks){
            return res.status(200).json({message: "No task pending task"});
        }
        return res.status(200).json(tasks);
    } catch (error) {
        console.log("Error in pendingTasks: ", error);
        next(error);
    }
}

const getPriorityTasks = async (req, res, next) => {
    try {
        
    } catch (error) {
        console.log("Error in getPriorityTasks: ", error);
        next(error);
    }
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  markComplete,
  getPendingTasks,
  getPriorityTasks
};
