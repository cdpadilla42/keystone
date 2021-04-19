const { createTransport, getTestMessageUrl } = require('nodemailer');
const { handleErrors } = require('../lib/catchErrors');
require('dotenv').config({ path: '.env' });

const transporter = createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function makeANiceEmail(text) {
  return `
  <div style="
  border: 1px solid black;
  padding: 20px;
  font-family: sans-serif;
  line-height: 2;
  font-size: 20px;
">
  <h2>Hello There!</h2>
  <p>${text}</p>
  <p>😘, Chris Padilla</p>
</div>
  `;
}

exports.sendAnEmail = handleErrors(async function (to) {
  const info = await transporter.sendMail({
    to,
    from: 'cdpadillapub@gmail.com',
    subject: 'Greetings from Taco Time!',
    html: makeANiceEmail(`Good to see you bud!`),
  });
  if (process.env.EMAIL_USER.includes('ethereal.email')) {
    console.log(`💌 Message Sent! Preview at ${getTestMessageUrl(info)}`);
  }
  console.log(info);
});
