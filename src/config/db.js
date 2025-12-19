const mongoose = require("mongoose")
require("dotenv").config()

const connectDB = ()=>{
    // return mongoose.connect(process.env.mongoURI).then(()=>{console.log("MongoDB connected.")}).catch((error)=>{console.log("Error connecting to MongoDB.", error)})
    const db = mongoose.connect(process.env.mongoURI)
    mongoose.connection.on("connected", ()=>{
        console.log("MongoDB Connected");
    })
    mongoose.connection.on("error", ()=>{
        console.log("Error conencting to MongoDB")
    })
    mongoose.connection.on("disconnected", ()=>{
        console.log("MongoDB disconnected")
    })
}

module.exports = {connectDB}