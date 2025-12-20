const Users = require("../models/Users")
const Tasks = require("../models/Tasks")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "all fields are required" })
        }

        const existingUser = await Users.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new Users({ name, email, password: hashedPassword, role })
        await user.save()
        res.status(201).json(user)
    } catch (error) {
        console.log("Error in registerUser: ", error)
        next(error)
    }
}

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if(!email || !password){
            return res.status(400).json({message: "all fields are required"})
        }

        const user = await Users.findOne({email})
        if(!user){
            return res.status(404).json({message: "User not found"})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(401).json({message: "Invalid credentials"})
        }

        const token = jwt.sign({id: user._id, email: user.email, role: user.role}, process.env.JWT_SECRET, {expiresIn: "1d"})
        res.status(200).json({user, token})
    } catch (error) {
        console.log("Error in loginUser: ", error)
        next(error)
    }
}

const profile = async (req, res, next) => {
    try {
        const user = await Users.findById(req.user.id).populate("tasks")
        res.status(200).json(user)
    } catch (error) {
        console.log("Error in profile: ", error)
        next(error)
    }
}

module.exports = {
    registerUser,
    loginUser,
    profile
}