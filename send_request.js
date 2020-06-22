const axios = require('axios');

async function sendRequest(dataToSend, token) {

  return new Promise((resolve, reject) => {
    try {
      axios.post('https://api.airtm.com/graphql',
        dataToSend, {
        headers: {
          authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      }).then(function (response) {
        if (!!response.data.data) {
          resolve(response.data.data);
        }
      }).catch(function (error) {
        reject(error);
        console.log(error);
      });

    } catch (error) {
      reject(error);
      console.error(error);
    }
  }); // end Promise
} // end resendInvitation

module.exports = {
  sendRequest
}