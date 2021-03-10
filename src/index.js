const express = require('express');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use([userRouter, taskRouter]);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})