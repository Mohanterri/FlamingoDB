//import libs
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const jwt_lib = require('./jwt_lib.js');

//create instanse of server
const server = express();

//set params of server
server.use(express.json());
server.use(cors());

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

async function set_router(serve, route, feetback){
    if(serve.is_started){
        serve.get(route, feetback);
        return feetback;
    }
    console.error(`http://${serve.host}:${serve.port} server not stared`);
}

// defined master router
server.post("/db", started);
server.post("/db/create-token", jwt_lib.createToken);
server.post("/db/create", jwt_lib.authenticateToken, create);

function start_server(host, port, feetback){
    server.set('host', host)
    server.set('port', port)
    server.is_started = true;
    server.listen(port, feetback(server, host, port));
}

module.exports = {
    start_server,
    set_router
}