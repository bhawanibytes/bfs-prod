
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sendVerification = require('./config/requestsms');
const checkVerification = require('./config/verify');
require('dotenv').config();

app.use(bodyParser.json());
app.use('/api', sendVerification);
app.use('/api', checkVerification);

const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send('Welcome to the Phone Verification API!');
} );
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
