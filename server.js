const express = require("express")
const db = require("./src/config/db")
require("dotenv").config()
const app = express()

const PORT = process.env.PORT || 3000



app.get("/health", (req, res)=>{
    try {
        res.status(201).json({message: "server is running"})
    } catch (error) {
        res.status(500).json(error.message)
    }
})

app.listen(PORT,()=>{
    console.log("Server running on port 3000")
})

db.connectDB()