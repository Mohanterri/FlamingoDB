const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();
const secret_token = process.env.TOKEN_SECRET;

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  
  if (secret_token === undefined){
    console.error("Undefined TOKEN_SECRET", 301)
    return res.send({status : 301, msg : "Undefined TOKEN_SECRET"});
  } 
  
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
  if (secret_token === undefined){
    console.error("Undefined TOKEN_SECRET", 301)
    return res.send({status : 301, msg : "Undefined TOKEN_SECRET"});
  } 
  const token = generateAccessToken({ key: req.body.key, key: req.body.expired });
  res.json(token);
}

module.exports = {
	authenticateToken, createToken
};