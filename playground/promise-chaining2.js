require('../src/db/mongoose');
const Task = require('../src/models/task');

Task.findByIdAndDelete('602bbfeda234dc1f63423273').then((task) => {
    console.log(task);
    return Task.countDocuments({ completed: false })
}).then((result) => {
    console.log(result);
}).catch((error) => {
    console.error(error);
})