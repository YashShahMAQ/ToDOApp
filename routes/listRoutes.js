const express = require('express');
const authMiddleware = require('../middleware/auth');
const List = require('../models/List');

const router = express.Router();

router.get("/lists", authMiddleware, async (req, res) => {
    try {
        console.log("Debugging the user id");
        console.log(req.user.id);
        const lists = await List.find({ userId: req.user.id }).sort({ createdAt: -1 });
        console.log("Debugging the lists");
        res.status(200).json(lists);
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "There is an error while getting the TO-DO List" });
    }
});

router.post("/lists", authMiddleware, async (req, res) => {
    try{
        const {name} = req.body;

        if(!name) {
            return res.status(400).json({ message: "List Name is required" });
        }

        const newList = new List({
            userId: req.user.id,
            name,
        });

        const savedList = await newList.save();
        res.status(201).json(savedList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "There is an error while creating a List" });
    }
});

router.put("/lists/:id", authMiddleware, async (req, res) => {
    try{
        const {id} = req.params;
        const {name} = req.body;

        if(!name) {
            return res.status(400).json({ message: "List Name is required" });
        }

        const list = await List.findOne({ _id: id, userId: req.user.id });

        if(!list) {
            return res.status(404).json({ message: "List not found" });
        }

        list.name = name;
        const updatedList = await list.save();

        res.status(200).json(updatedList);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "There is an error while updating the List" });
    }
});

router.delete("/lists/:id", authMiddleware, async (req, res) => {
    try{
        const {id} = req.params;

        const list = await List.findOneAndDelete({ _id: id, userId: req.user.id });

        if(!list) {
            return res.status(404).json({ message: "List not found" });
        }

        res.status(200).json({ message: "List deleted" }); 

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "There is an error while deleting the List" });
    }
});


module.exports = router;