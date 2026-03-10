const Activity = require("../models/Activity");

const getAllActivities = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const activities = await Activity.find({userId}).sort({date: -1}).limit(3);
        return res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving activities", error: error.message });
        next(error);
    }
}

const createActivity = async ({ userId, type, message, taskId }) => {
    try {
        const newActivity = new Activity({
            userId,
            type,
            message,
            taskId
        });
        await newActivity.save();
    } catch (error) {
        console.log("Error in activityController.js: ", error.message);
    }
}

module.exports = {
    getAllActivities,
    createActivity
}