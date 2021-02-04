const { MongoClient, ObjectID } = require('mongodb');


const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

const id = new ObjectID();

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database!', error);
    }

    console.log('Connected to database!');

    const db = client.db(databaseName);

    /*db.collection('users').insertOne({
        name: 'Viktor',
        age: 54
    }, (error, result) => {
        if (error) {
            return console.log('Unable to insert user');            
        }

        console.log(result.ops);
    });*/

    /*db.collection('users').insertMany([
        {
            name: 'Lucas2',
            age: 33
        },
        {
            name: 'Albert',
            age: 33
        }
    ], (error, result) => {
        if (error) {
            return console.log('Unable to insert documents');
        }

        console.log(result.ops);
    });*/

    /*db.collection('tasks').insertMany([
        {
            description: 'First task',
            completed: true
        },
        {
            description: 'Second task',
            completed: false
        }

    ], (error, result) => {
        if (error) {
            return console.log('Unable to insert tasks');
        }

        console.log(result.ops);
    });*/



});