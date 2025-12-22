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
        type: Number,
        required: true,
        enum: [1,2,3],
    },
    status: {
        type: String,
        required: true,
        enum: ["Pending", "completed"],
        default: "Pending"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
},{
    versionKey: false
})

const Task = mongoose.model("Tasks", taskSchema)

module.exports = Task