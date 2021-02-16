require('../src/db/mongoose');
const User = require('../src/models/user');

/*User.findByIdAndUpdate('60230c16b5dcf0a2ce80cf50', { age: 27 }).then((user) => {
    console.log(user);

    return User.countDocuments({ age: 23 })
}).then((result) => {
    console.log(result);
}).catch((error) => {
    console.error(error);
})*/

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age });
    const count = await User.countDocuments({ age });

    return count;
};

updateAgeAndCount('60230c16b5dcf0a2ce80cf50', 2).then((count) => {
    console.log(count);
}).catch((error) => {
    console.error(error);
})