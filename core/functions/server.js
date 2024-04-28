//import libs
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const jwt_lib = require('./jwt_lib.js');
const secures = require('./secures.js');

//create instanse of server
const server = express();

//set params of server
server.use(express.json());
server.use(cors());
const post_secure = secures.post_secure;

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

    res.send( req.body );
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