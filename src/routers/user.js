require('../db/mongoose');
const { Router } = require("express");
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = new Router;

router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();
        res.send({ user, token });

    } catch (error) {
        console.error(error);
        res.sendStatus(400);
    }
});

router.get('/users/me', auth, async (req, res) => res.send(req.user));

router.get('/users/:id', async (req, res) => {
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

router.patch('/users/:id', async (req, res) => {
    const userToBeUpdated = req.body;
    const updates = Object.keys(userToBeUpdated);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    const id = req.params.id;

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send();
        }

        updates.forEach(update => user[update] = userToBeUpdated[update]);
        const userUpdated = await user.save();


        res.send(userUpdated)

    } catch (error) {
        res.status(400).send();
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const userDeleted = await User.findByIdAndDelete(id);

        if (!userDeleted) {
            return res.status(404).send();
        }

        res.send(userDeleted);

    } catch (error) {
        res.send(500).send();
    }
});

module.exports = router;