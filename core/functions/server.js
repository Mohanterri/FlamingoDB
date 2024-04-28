//import libs
require('rootpath')();
const cors = require('cors');
const json_db = require('node-json-db');
const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt_lib = require('./jwt_lib.js');
const secures = require('./secures.js');
const router = require('./router.js');
const inteface = require('../libs/interfaces/index.js');


const dbconfig = new json_db.Config("databases/db.json", true, false, "/");
const jsondb = json_db.JsonDB;

//create instanse of server
const server = express();

//set params of server
server.use(express.json());
server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

const post_secure = secures.post_secure;
const db = new jsondb(dbconfig);
const routes = require('./router.js')(server, fs);


function setup(){
    server.post("/db/create", post_secure, jwt_lib.authenticateToken);
}

// defined master router
server.post("/db/create-token", post_secure, jwt_lib.createToken);

function start_server(host, port, feetback){
    server.set('trust proxy', true);
    server.is_started = true;
    setup();
    server.listen(port, feetback(server, host, port));
}

module.exports = {
    start_server
}