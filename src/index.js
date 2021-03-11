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


const myFunction = async () => {
    const password = "luC@S";
    const hashedPassword = await bcrypt.hash(password, 8);

    console.log('------password------');
    console.log(password);
    console.log('------------');

    console.log('------hashedPassword------');
    console.log(hashedPassword);
    console.log('------------');

    const isMatch = await bcrypt.compare(password, hashedPassword);

    console.log('------unhashedPassword------');
    console.log(isMatch);
    console.log('------------');
}

myFunction();