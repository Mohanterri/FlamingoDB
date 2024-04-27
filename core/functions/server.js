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
* this function create element of database
* to create project, table, field
* @params object, name, credential
*/
async function started(req, res, next){

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


async function set_router(route, feetback){
    if(is_started()){
        server.post(route, feetback);
        server.get(route, feetback);
        return feetback;
    }
    console.error("server not stared");
}


server.post("/db", started);
server.post("/db/create", jwt_lib.authenticateToken, create);
server.post("/db/create-token", jwt_lib.createToken);


function start_server(port, feetback){
    runing = true;
    server.listen(port, feetback('localhost', port));
}

module.exports = {
    start_server,
    set_router
}