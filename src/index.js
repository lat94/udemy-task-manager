const express = require('express');
const bcrypt = require('bcryptjs');
const routes = require('./routers/index');

const app = express();
const PORT = process.env.PORT || 3000;

const multer = require('multer');
const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        /*if (!file.originalname.endsWith('.pdf')) {
            return cb(new Error('File extension not supported'));           
        }*/
        
        /*if (!file.originalname.match(/\.doc[x]?$/)) {
            return cb(new Error('Please, upload a WORD document'));           
        }*/
        
        cb(undefined, true);
    }
});

app.post('/upload', upload.single('upload'), (req, res) => {
    res.send();
})

app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

const Task = require('./models/task');
const User = require('./models/user');