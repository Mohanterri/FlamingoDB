const dotenv = require('dotenv');
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.set('port', 3000);

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  const secret_token = req.body.secret_token ? '' : req.body.secret_token;
  
  if (secret_token === '') return res.sendStatus(401, "TOKEN_SECRET Forbiden");
  if (token == null) return res.sendStatus(401);
  
  jwt.verify(token, secret_token, (err, value) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.value = value
    next()
  })
}

function generateAccessToken(key, expired) {
  return jwt.sign(key, secret_token, { expiresIn: expired });
}

function createToken(req, res, next){
  const secret_token = req.body.secret_token;
  if (secret_token == null) return res.sendStatus(401, "TOKEN_SECRET Forbiden");
  const token = generateAccessToken({ key: req.body.key, key: req.body.expired });
  res.json(token);
}

app.post('/api/create_token', createToken);

app.post('/api/auth', authenticateToken);


module.exports = {
	app, authenticateToken, generateAccessToken
};