const express = require('express');
const router = express.Router();
const twilio = require('twilio');
require('dotenv').config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

router.post('/send-verification', async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    const verification = await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications
      .create({ to: phoneNumber, channel: 'sms' });
    res.status(200).send({ message: 'Verification code sent', sid: verification.sid });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;