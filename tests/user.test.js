const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const userOneId = new mongoose.Types.ObjectId();

const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'mike@hotmail.com',
    password: 'm!k3@mike',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
    await User.deleteMany();
    await new User(userOne).save();
});

afterEach(() => {
});

test('should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'New User',
        email: 'new_user@hotmail.com',
        password: 'NeWUs3R@'
    }).expect(201);

    // assert that the database was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'New User'
        },
        token: user.tokens[0].token
    });

    expect(user.password).not.toBe('NeWUs3R@');
});

test('should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200);

    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token);
});

test('should not login nonexisting user', async () => {
    response = await request(app).post('/users/login').send({
        email: 'dfdfsdf@mail.com',
        password: '33333'
    }).expect(400);

});


test('should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test('should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401);
});

test('should delete account for user', async () => {
    response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user).toBeNull();
});

test('should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401);
});

test('should upload avatar image', async () => {
    response = await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test('should update valid user fields', async () => {
    response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Changed Name'
        })
        .expect(200);

    const user = await User.findById(userOneId);

    expect(user.name).toBe('Changed Name');
});

test('should not update invalid user fields', async () => {
    response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'there\'s no such a thing'
        })
        .expect(400);
});