const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/task');




router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save();
        res.status(201).send(task);
    }
    catch (e) {
        res.status(400).send();
    }
})


//Get /tasks?completed=value
//GET /tasks?limit=2&skip=4
//Get /tasks?sortBy=createdAt:desc  
router.get('/tasks', auth, async (req, res) => {
    const match = {};
    const sort = {};

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] ==='desc'? -1 : 1;
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }

})


router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;


    try {
        // const task = await Task.findById(_id);

        const task = await Task.findOne({ _id, owner: req.user._id });

        if (!task) {
            return res.status(404).send('no task found');
        }
        res.send(task);
    }
    catch (e) {
        res.status(500).send('Error fetching task or Invalid ID');
    }

})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdate = ['discription', 'completed'];
    const isValiedOperation = updates.every((update) => allowedUpdate.includes(update))
    if (!isValiedOperation) {
        res.status(400).send({ error: 'Invalid Updates!' })
    }
    try {

        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }

        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        res.send(task);
    }
    catch (e) {
        res.status(400).send(e);
    }
})


router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            res.status(404).send();
        }
        res.send(task);
    }
    catch (e) {
        res.status(500).send();
    }
})

module.exports = router;