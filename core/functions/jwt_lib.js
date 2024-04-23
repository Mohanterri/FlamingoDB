const dotenv = require('dotenv');
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.set('port', 3000);

dotenv.config();
const secret_token = process.env.TOKEN_SECRET;

app.post('/api/createNewUser', (req, res) => {
  const token = generateAccessToken({ username: req.body.username });
  res.json(token);
});

function generateAccessToken(username) {
  return jwt.sign(username, secret_token, { expiresIn: '1800s' });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  
  if (token == null) return res.sendStatus(401);
  
  jwt.verify(token, secret_token, (err, user) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

module.exports = {
	app,
	authenticateToken,
	generateAccessToken
};