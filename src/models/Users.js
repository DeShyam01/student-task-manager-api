const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
   },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        Enum: ["admin", "student"],
        default: "student"
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

const User = mongoose.model("User", userSchema)

module.exports = User