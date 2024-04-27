//import libs
const express = require('express');
const cors = require('cors');

//create instanse of server
const server = express();

//set params of server
server.use(express.json());
server.use(cors());

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

server.post("/flamingodb/", async (req, res) => {
    res.send({
        app_name : "flamingodb"
    });
});

server.get("/flamingodb/", async (req, res) => {
    res.send("Welcome");
});

function start_server(port){
    runing = true;
    server.listen(port, () => {
        console.log(`Server it\'s started and listen port : ${port}`);
    });
}

module.exports = {
    start_server,
    set_router
}