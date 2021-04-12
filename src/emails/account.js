const sgMail = require('@sendgrid/mail');

const { SEND_GRID_API_KEY } = process.env;
const verifiedEmail = 'lucas.tx94@hotmail.com';

sgMail.setApiKey(SEND_GRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: verifiedEmail,
        subject: 'Thanks for joining us!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app`
    });
};

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: verifiedEmail,
        subject: 'Sorry to see you go!',
        text: `We are sad to see you going, ${name}. Are there something that we could do to improve?`
    });
};

module.exports = { sendWelcomeEmail, sendCancelationEmail };