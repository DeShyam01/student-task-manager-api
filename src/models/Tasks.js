const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    priority: {
        type: String,
        required: true,
        enum: ["High", "Medium", "Low"]
    },
    status: {
        type: String,
        required: true,
        enum: ["Pending", "completed"],
        default: "Pending"
    }
},{
    versionKey: false
})

const Task = mongoose.model("Tasks", taskSchema)

module.exports = Task