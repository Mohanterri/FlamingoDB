//import libs
const express = require('express');
const cors = require('cors');
const jwt_lib = require('./jwt_lib.js');

//create instanse of server
const server = express();

//set params of server
server.use(express.json());
server.use(cors());
//server.use(jwt_lib.authenticateToken);

var runing = false;

/*
* this function create element of database
* to create project
* @params object, name, credential
*/
function create(req, res, next){
    //get object to creating
    const object = req.body.object;

    //get name of object
    const name = req.body.name;

    //get request credential
    const credential = req.body.credential;
}

function is_started(){
    return runing;
}


function set_router(route, feetback){
    if(is_started()){
        server.post(route, feetback);
        server.get(route, feetback);
        return feetback;
    }
    console.error("server not stared");
}

server.post("/create-token", jwt_lib.createToken);

server.post("/", async (req, res) => {
    res.send({
        app_name : "flamingodb"
    });
});

server.get("/", async (req, res) => {
    res.send("Welcome");
});

function start_server(port, feetback){
    runing = true;
    server.listen(port, feetback('localhost', port));
}

module.exports = {
    start_server,
    set_router
}