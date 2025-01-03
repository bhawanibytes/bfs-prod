const express = require('express');
const router = express.Router();
const twilio = require('twilio');
require('dotenv').config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

router.post('/check-verification', async (req, res) => {
  const { phoneNumber, code } = req.body;
  try {
    const verificationCheck = await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks
      .create({ to: phoneNumber, code });
    if (verificationCheck.status === 'approved') {
      res.status(200).send({ message: 'Phone number verified' });
    } else {
      res.status(400).send({ message: 'Invalid verification code' });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;