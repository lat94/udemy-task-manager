const dotenv = require('dotenv').config();
const sgMail = require('@sendgrid/mail');

const { SEND_GRID_API_KEY } = process.env;

console.log('------SEND_GRID_API_KEY------');
console.log(SEND_GRID_API_KEY);
console.log('------------');

sgMail.setApiKey(SEND_GRID_API_KEY);

const msg = {
    to: 'amanda_ata15@hotmail.com', // Change to your recipient
    from: 'lucas.tx94@hotmail.com', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'testando u3hu3hu3hu',
}

sgMail.send(msg)
    .then(value => console.log(value))
    .catch(error => console.error(error));