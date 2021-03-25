const express = require('express');
const bcrypt = require('bcryptjs');
const routes = require('./routers/index');

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.status(503).send({message: 'WebSite is under maintenance!'});
});

app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

const jwt = require('jsonwebtoken');

const myFunction = async () => {
}

myFunction();