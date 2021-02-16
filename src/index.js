require('./db/mongoose');
const express = require('express');
const Task = require('./models/task');
const User = require('./models/user');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json())


app.post('/users', (req, res) => {
    const user = new User(req.body);
    user.save().then((result) => {
        res.status(201).send(result);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

app.get('/users', (req, res) => {
    User.find({}).then((users) => {
        res.send(users);
    }).catch((error) => {
        res.status(500).send({ status: 500, message: error });
    });
});

app.get('/users/:id', (req, res) => {
    const _id = req.params.id;
    User.findById({ _id }).then((user) => {
        if (!user) {
            return res.status(404).send;
        }

        res.send(user);
    }).catch((error) => {
        res.status(500).send({ status: 500, message: error });
    });
});

app.post('/tasks', (req, res) => {
    const task = new Task(req.body);
    task.save().then((result) => {
        res.status(201).send(result);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

app.get('/tasks', (req, res) => {
    Task.find({}).then((tasks) => {
        res.send(tasks);
    }).catch((error) => {
        res.status(500).send({ status: 500, message: error });
    });
});

app.get('/tasks/:id', (req, res) => {
    const _id = req.params.id;
    Task.findById({ _id }).then((task) => {
        if (!task) {
            return res.status(404).send;
        }

        res.send(task);
    }).catch((error) => {
        res.status(500).send({ status: 500, message: error });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})