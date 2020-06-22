#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('inquirer');
const { getInvitees } = require('./get_invitees');
const { resendInvitation } = require('./resend_invitees');
const { sendInvitation } = require('./send_invitees');
const CLI = require('clui');
const fs = require('fs');
const parse = require('csv-parse')
const Spinner = CLI.Spinner;

var argv = require('minimist')(process.argv.slice(2));

async function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}
const options = [ 
  'Load emails from csv and send invitations.', 
  'Resend Invitations.',
  'Show ACTIVE emails.',
  'Show all loaded emails.',
  'Show GUEST emails.',
   new inquirer.Separator()
];
let token;
let interval = argv.interval || 30000
let perInterval = argv.mailsPerInterval || 25;
let emails = [];

console.log(chalk.green(
  figlet.textSync('Airtm Invitees', {
    font: 'Fire Font-k',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  })
));

inquirer.prompt([
  {
    name: 'token',
    type: 'input',
    message: 'Enter the token obeteined from airtm after login:',
    validate: function( value ) {
      if (!!value.length) {
        return true;
      } else {
        return 'Please enter the token.';
      }
    }
  },
  {
    name: 'option',
    type: 'rawlist',
    message: 'Please select an option:',
    choices: options,
    validate: function( value ) {
      if (!!value.length) {
        return true;
      } else {
        return 'Please enter the token.';
      }
    }
  }
]).then(answers => {
  
  token = answers.token;

  switch(answers.option) {
    // Load emails form csv
    case options[0]:
      inquirer.prompt([
        {
          name: 'csv_file',
          type: 'input',
          message: 'Enter the cvs file path that contain the emails:',
          validate: function( value ) {
            if (value.length && /^(\/[\w^ ]+)+\/?([\w.])+[^.]\.csv$/.test(value)) {
              return true;
            } else {
              return 'Please enter a valid absolute file path.';
            }
          }
        }
      ]).then(async (answer) => {
        const loadingCsv = new Spinner('Loading al emails from csv...');
        loadingCsv.start();

        fs.createReadStream(answer.csv_file)
          .pipe(parse())
          .on('data', (row) => {
            emails.push(row[0]);
          })
          .on('end', async (data) => {
            loadingCsv.stop();
            console.log(
              chalk.green('\n' + emails.length + ' emails are going to be loaded into Airtm \n')
            );
          
            let i = 0;

            for (let email of emails) {
              if (i !== 0 && (i % perInterval) === 0) {
                let seconds = (interval / 1000);
                console.log(chalk.green('Wait ' + seconds + ' seconds to send invitation...\n' ));
                // pause iteration for interval
                await sleep(interval);
              }

              console.log(chalk.blue('Sending invitation to: ' + email + '\n'));

              let invitationSent = await sendInvitation(email, token);

              if (!!invitationSent.inviteUser) {
                console.log(chalk.green('Invitation sent!, invitee id: ' + invitationSent.inviteUser.inviteeId + '  \n'));
              }
              i++;
            }
          });
      });
      break;
    // Resend invitation
    case options[1]:
      const loadingEmails = new Spinner('Getting guest emails from airtm...');
      loadingEmails.start();

      getInvitees(token).then(async (data) => {
        let i = 0;
        let sentCount = 0;
        
        if (!!data.invitations) {
          loadingEmails.stop();

          for (let invitation of data.invitations) {
            if (invitation.invitee.status === 'GUEST') {
              if (i !== 0 && (i % perInterval) === 0) {
                let seconds = (interval / 1000);
                console.log(chalk.green('Wait ' + seconds + ' seconds to resend the emails...\n' ));
                // pause iteration for interval
                await sleep(interval);
              }
              console.log(chalk.green('Sending invitation to: ' + invitation.invitee.email + '\n'));
        
              let wasSent = await resendInvitation(invitation.invitee.id, token);
        
              if (wasSent) {
                console.log(chalk.green('Intitation sent! \n'));
                sentCount++;
              }
              i++;
            }
          } // end for
          console.log(chalk.green('Invitations Sent: ' + sentCount + '\n'));
          clear(); 
        }
      });
      break;
    // Show ACTIVE emails.
    case '':
      
      break;
    // Show all loaded emails.
    case '':
    
      break;
    // Show GUEST emails.
    case '':
    
      break;
  }
}).catch(error => {
  console.log('Error', error);
});

// console.log(chalk.blue('By Thomas Anderson'));