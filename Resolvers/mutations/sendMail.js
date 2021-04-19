const { sendAnEmail } = require('../../lib/mail');

module.exports = async function sendMail(_, args, context, info) {
  sendAnEmail('somebody@test.com');
  return 'success';
};
