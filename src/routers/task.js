require('../db/mongoose');
const { Router } = require('express');
const Task = require('../models/task');

const router = new Router;

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body);

    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks);

    } catch (error) {
        res.status(500).send({ status: 500, message: error });
    }
});

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findById({ _id });
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send({ status: 500, message: error });
    }
});

router.patch('/tasks/:id', async (req, res) => {
    const taskToBeUpdated = req.body;
    const updated = Object.keys(taskToBeUpdated)
    const allowedUpdates = ['completed', 'description'];
    const isValidOperation = updated.every((update) => allowedUpdates.includes(update));
    const id = req.params.id;

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try {
        const taskUpdated = await Task.findByIdAndUpdate(id, taskToBeUpdated, { new: true, runValidators: true });

        if (!taskUpdated) {
            return res.status(404).send();
        }

        res.send(taskUpdated)

    } catch (error) {
        res.status(400).send();
    }
});

router.delete('/tasks/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const taskDeleted = await Task.findByIdAndDelete(id);

        console.log('------taskDeleted------');
        console.log(taskDeleted);
        console.log('------------');

        if (!taskDeleted) {
            return res.status(404).send();
        }

        res.send(taskDeleted);
        
    } catch (error) {
        res.send(500).send();
    }
});

module.exports = router;