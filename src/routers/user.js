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

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send();

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        const user = req.user;
        user.tokens = [];
        await user.save();
        res.send();
    } catch (error) {
        console.error(error);
        res.sendStatus(500);        
    }

})

router.get('/users/me', auth, async (req, res) => res.send(req.user));

router.patch('/users/me', auth, async (req, res) => {
    const userToBeUpdated = req.body;
    const updates = Object.keys(userToBeUpdated);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try {
        const user = req.user;

        updates.forEach(update => user[update] = userToBeUpdated[update]);
        const userUpdated = await user.save();


        res.send(userUpdated)

    } catch (error) {
        res.status(400).send();
    }
});

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();

        res.send(req.user);

    } catch (error) {
        res.send(500).send();
    }
});

module.exports = router;