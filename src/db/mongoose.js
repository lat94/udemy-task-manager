const mongoose = require('mongoose');

const { MONGODB_URL } = process.env;


mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});