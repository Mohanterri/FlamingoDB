//import libs
const cors = require('cors');
const json_db = require('node-json-db');
const bodyParser = require('body-parser');
const express = require('express');
const https = require('https')
const fs = require('fs');
const path = require('path');
const jwt_lib = require('./jwt_lib.js');
const secures = require('./secures.js');
const router = require('./router.js');
const inteface = require('../libs/interfaces/index.js');

//create instanse of server
const server = express();

//set params of server
server.use(express.json());
server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

var options = {
    key: fs.readFileSync(__dirname + '/../certs/server.key', 'utf8'),
    cert: fs.readFileSync(__dirname + '/../certs/server.crt', 'utf8')
};

const dbconfig = new json_db.Config("databases/db.json", true, false, "/");
const jsondb = json_db.JsonDB;
const db = new jsondb(dbconfig);

const post_secure = secures.post_secure;
const routes = require('./router.js')(server, db);

function setup(){
    routes.get("/projects", jwt_lib.authenticateToken, (req, res) => {
        res.send({});
    });
    routes.post("/db/create", post_secure, jwt_lib.authenticateToken);
}

// defined master router
routes.post("/auth/create-token", (req, res, next) =>{
    
    next();
}, jwt_lib.createToken);

function start_server(host, port, feetback){
    routes.set('trust proxy', true);
    routes.is_started = true;
    setup();
    //https.createServer(options, routes).listen(port, feetback(server, host, port));
    routes.listen(port, feetback(server, host, port));
}

module.exports = {
    start_server
}