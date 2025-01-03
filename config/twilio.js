const twilio = require("twilio");
const { twilioAccountSid, twilioAuthToken } = require("./env");
const client = twilio(twilioAccountSid, twilioAuthToken);
module.exports = client;
