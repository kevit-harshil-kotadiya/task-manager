const postmark = require('postmark');

// Send an email:
const client = new postmark.ServerClient(process.env.SENDGRID_API_KEY);


const sendWelcomeEmail  = (email,name)=>{

    client.sendEmail({
        "From": "harshil.kotadiya@kevit.io",
        "To": email,
        "Subject": "Hello from Harshil",
        "HtmlBody": "<strong>Hello Welcome to TaskManager.io</strong>",
        "TextBody": `Welcome to the app ${name}. Let me know how you get along with the app.`,
        "MessageStream": "outbound"
      });
}

const sendCancelationEmail  = (email,name)=>{

    client.sendEmail({
        "From": "harshil.kotadiya@kevit.io",
        "To": email,
        "Subject": "Sorry to see you go!",
        "HtmlBody":`<strong>Hello ${name} Please let us know why you canceled</strong>`,
        "TextBody": `Welcome to the app ${name}. Let me know how you get along with the app.`,
        "MessageStream": "outbound"
      });
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}
