const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const authMiddleware = async (req, res, next) => {
    try {
        const {token} = req.headers
        if(!token){
            return res.status(401).json({message: "Unauthorized"})
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        if(!decodedToken){
            return res.status(401).json({message: "Invalid Token"})
        }
        req.user = decodedToken
        next()
    } catch (error) {
        return res.status(401).json({error: error.message})
    }
}

module.exports = authMiddleware