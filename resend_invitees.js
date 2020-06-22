const { sendRequest } = require('./send_request');

async function resendInvitation(uuid, token) {

  let dataToSend = {
    "operationName": "RemindInvitee",
    "variables": { "inviteeId": uuid },
    "query": "mutation RemindInvitee($inviteeId: UUID!) {\n  sendInvitationReminder(inviteeId: $inviteeId)\n}\n"
  };

  return sendRequest(dataToSend, token);
} // end resendInvitation

module.exports = {
  resendInvitation
}