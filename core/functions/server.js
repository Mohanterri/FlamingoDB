//import libs
require('rootpath')();
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const jwt_lib = require('./jwt_lib.js');
const secures = require('./secures.js');
const json_db = require('node-json-db');
const inteface = require('../libs/interfaces/index.js');


const dbconfig = new json_db.Config("databases/db.json", true, false, "/");
const jsondb = json_db.JsonDB;

//create instanse of server
const server = express();

//set params of server
server.use(express.json());
server.use(cors());
const post_secure = secures.post_secure;
const db = new jsondb(dbconfig);


/*
* started page
*/
async function started(req, res, next){
    res.send({ msg : "work" })
}



/*
* this function create element of database
* to create project, table, field
* @params object, name, credential
*/
async function create(req, res, next){
    const name = req.body.name;
    const element = req.body.element;
    const credential = req.body.credential;

    
}

async function set_router(serve, route, secures, feetback){
    if(serve.is_started){
        if(secures === true){
            serve.get(route, post_secure, feetback);
        }else{
            serve.get(route, feetback);
        }
        return feetback;
    }
    console.error(`http://${serve.host}:${serve.port} server not stared`);
}

// defined master router
server.post("/db", started);
server.post("/db/create-token", post_secure, jwt_lib.createToken);
server.post("/db/create", post_secure, jwt_lib.authenticateToken, create);

function start_server(host, port, feetback){
    server.set('host', host)
    server.set('port', port)
    server.set('trust proxy', true);
    server.is_started = true;
    server.listen(port, feetback(server, host, port));
}

module.exports = {
    start_server,
    set_router
}