const { sendRequest } = require('./send_request');

async function getInvitees(token) {

  let dataToSend = {
    "operationName": "Invitations",
    "variables": {},
    "query": "query Invitations {\n  invitations {\n    id\n    inviteeId\n    referrerId\n    status\n    invitee {\n      id\n      email\n      firstName\n      status\n      __typename\n    }\n    __typename\n  }\n  revenue\n  totalP2PCompletedByInvitees\n}\n"
  };

  return sendRequest(dataToSend, token);
}

module.exports = {
  getInvitees
};