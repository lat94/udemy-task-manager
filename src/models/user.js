const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const { JWT_SECRET } = process.env;

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        min: 0,
        max: 150,
        default: 0
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});

// virtual propertyies: relationship by 2 entities
userSchema.virtual('tasks', {
    ref: 'Task',
    // the field that will store user's id to compare with foreignField
    localField: '_id',

    // the field that the mongoose will look in to it, to have the user's id
    foreignField: 'owner'
});

// use methods for specific instance of user(user)

//overriding the method that express calls when returning the response(res.send())
userSchema.methods.toJSON = function (params) {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
}

userSchema.methods.generateAuthToken = async function (params) {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET);

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
};

// use statics for the class User
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Unable to log in');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw new Error('Unable to login');
    }

    return user;
};


// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})

// delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this;

    await Task.deleteMany({ owner: user._id });


    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;