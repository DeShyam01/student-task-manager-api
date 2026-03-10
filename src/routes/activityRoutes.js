const express = require("express");
const { getAllActivities } = require("../controllers/activityController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", authMiddleware, getAllActivities);
module.exports = router;