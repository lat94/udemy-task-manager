const express = require('express');
const bcrypt = require('bcryptjs');
const routes = require('./routers/index');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

const Task = require('./models/task');
const User = require('./models/user');

const main = async () => {
    //const task = await Task.findById('606b769b226571bd94c19f26');
    //const user = await task.populate('owner').execPopulate();

    const user = await User.findById('606b752171b372bc308e18fd');
    await user.populate('tasks').execPopulate();

   


};

main();