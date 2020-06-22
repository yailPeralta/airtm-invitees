const { sendRequest } = require('./send_request');
const parse = require('csv-parse')

async function sendInvitation(email, token) {

  let dataToSend = {
    "operationName": "SendInvite",
    "variables": { "invitee": email },
    "query": "mutation SendInvite($invitee: Email!) {\n  inviteUser(invitee: $invitee) {\n    id\n    inviteeId\n    referrerId\n    status\n    invitee {\n      id\n      email\n      firstName\n      status\n      __typename\n    }\n    __typename\n  }\n}\n"
  };
  
  return sendRequest(dataToSend, token);
} // end resendInvitation

module.exports = {
  sendInvitation
}