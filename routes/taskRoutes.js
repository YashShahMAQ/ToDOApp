const express = require("express");
const authMiddleware = require("../middleware/auth");
const Task = require("../models/Task");

const router = express.Router();

router.get("/tasks/:listId", authMiddleware, async (req, res) => {
    try {
        const { listId } = req.params;
        if (!listId) {
            return res.status(400).json({ message: "List ID is required" });
        }
        const tasks = await Task.find({ listId, userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "There is an error while getting the Tasks" });
    }
});

router.post("/tasks", authMiddleware, async (req, res) => {
    try {
        const { listId, description } = req.body;

        if (!listId || !description) {
            return res.status(400).json({ message: "List ID and Description are required" });
        }

        const newTask = new Task({
            listId,
            userId: req.user.id,
            description,
        });

        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "There is an error while creating a Task" });
    }
});

router.put("/tasks/:taskId", authMiddleware, async (req, res) => {
    try {
        const { taskId } = req.params;
        const { description, isCompleted } = req.body;

        const task = await Task.findOne({ _id: taskId, userId: req.user.id });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        if (description) {
            task.description = description;
        }

        if (isCompleted !== undefined) {
            task.isCompleted = isCompleted;
        }

        const updatedTask = await task.save();
        res.status(200).json(updatedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "There is an error while updating the Task" });
    }
});

router.delete("/tasks/:taskId", authMiddleware, async (req, res) => {
    try {
        const { taskId } = req.params;

        const task = await Task.findOneAndDelete({ _id: taskId, userId: req.user.id });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "There is an error while deleting the Task" });
    }
});

module.exports = router;