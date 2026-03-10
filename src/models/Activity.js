const mongoose = require("mongoose")

const activitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    type: {
      type: String,
      enum: ["create", "update", "delete", "complete"],
      required: true
    },
    message: {
        type: String,
        required: true
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
    }
},{
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model("Activity", activitySchema)