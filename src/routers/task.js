require('../db/mongoose');
const { Router } = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');

const router = new Router;

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

// GET /tasks?completed=true|false 
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=field:asc
router.get('/tasks', auth, async (req, res) => {
    try {
        const match = {};
        const sort = {};

        if (req.query.completed) {
            match.completed = req.query.completed === 'true'
        }

        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }
        
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        const tasks = req.user.tasks;
        res.send(tasks);

    } catch (error) {
        res.status(500).send({ status: 500, message: error });
    }
});

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOne({ _id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send({ status: 500, message: error });
    }
});

router.patch('/tasks/:id', auth, async (req, res) => {
    const taskToBeUpdated = req.body;
    const updates = Object.keys(taskToBeUpdated)
    const allowedUpdates = ['completed', 'description'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    const _id = req.params.id;

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try {
        const task = await Task.findOne({
            _id,
            owner: req.user._id
        });

        if (!task) {
            return res.status(404).send();
        }

        updates.forEach(update => task[update] = taskToBeUpdated[update]);
        const taskUpdated = await task.save();


        res.send(taskUpdated)

    } catch (error) {
        res.status(400).send();
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const taskDeleted = await Task.findOneAndDelete({
            _id,
            owner: req.user._id
        });

        if (!taskDeleted) {
            return res.status(404).send();
        }

        res.send(taskDeleted);

    } catch (error) {
        res.send(500).send();
    }
});

module.exports = router;