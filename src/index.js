const express = require('express');
const routes = require('./routers/index');

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});