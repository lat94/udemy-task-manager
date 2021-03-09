require('./db/mongoose');
const express = require('express');
const Task = require('./models/task');
const User = require('./models/user');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json())


app.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});

app.get('/users', async (req, res) => {

    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(500).send({ status: 500, message: error });
    }
});

app.get('/users/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById({ _id });
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send({ status: 500, message: error });
    }
});

app.patch('/users/:id', async (req, res) => {
    const userToBeUpdated = req.body;
    const updated = Object.keys(userToBeUpdated)
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updated.every((update) => allowedUpdates.includes(update));
    const id = req.params.id;

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try {
        const userUpdated = await User.findByIdAndUpdate(id, userToBeUpdated, { new: true, runValidators: true });

        if (!userUpdated) {
            return res.status(404).send();
        } 

        res.send(userUpdated)

    } catch (error) {
        res.status(400).send();
    }
});

app.post('/tasks', async (req, res) => {
    const task = new Task(req.body);

    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks);

    } catch (error) {
        res.status(500).send({ status: 500, message: error });
    }
});

app.get('/tasks/:id', async (req, res) => {
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

app.patch('/tasks/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const taskToBeUpdated = req.body;

        Task.findByIdAndUpdate(id, taskToBeUpdated, { new: true, runValidators: true })
    } catch (error) {
        
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})