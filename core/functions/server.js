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

var runing = false;

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

function is_started(){
    return runing;
}


async function set_router(serve, route, feetback){
    if(is_started()){
        serve.get(route, feetback);
        return feetback;
    }
    console.error("server not stared");
}

// defined master router
server.post("/db", started);
server.post("/db/create-token", jwt_lib.createToken);
server.post("/db/create", jwt_lib.authenticateToken, create);

function start_server(host, port, feetback){
    runing = true;
    server.set('host', host)
    server.listen(port, feetback(host, port));
    return server;
}


start_server('localhost', 6661, async (host, port) => { });


module.exports = {
    start_server,
    set_router
}