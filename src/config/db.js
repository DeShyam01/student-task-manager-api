const mongoose = require("mongoose")
require("dotenv").config()

const connectDB = ()=>{
    mongoose.connect(process.env.mongoURI)

    const db = mongoose.connection

    db.once("connected", ()=>{
        console.log("MongoDB Connected");
    })
    db.on("error", ()=>{
        console.log("Error conencting to MongoDB")
    })
}

module.exports = {connectDB}