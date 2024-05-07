const makeId = require('./random_id.js');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const fs = require('fs');

dotenv.config();
var secret_token = process.env.TOKEN_SECRET;

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  
  if (secret_token === undefined){
    secret_token = makeId.makeid(255, []);
    fs.writeFileSync('.env', `TOKEN_SECRET=${secret_token}`);
  } 

  if (token == null) return res.sendStatus(401);
  
  jwt.verify(token, secret_token, (err, value) => {
    if (err) return res.sendStatus(403)
    req.value = value
    next()
  })
}

function generateAccessToken(key) {
  return jwt.sign(key, secret_token);
}

function createToken(req, res, next){
  if (secret_token === undefined){
    secret_token = makeId.makeid(255, []);
    fs.writeFileSync('.env', `TOKEN_SECRET=${secret_token}`);
  } 
  const token = generateAccessToken(req.body.key);
  res.json(token);
}

module.exports = {
	authenticateToken, createToken
};