const http = require ('http');
const include = require('./core/includes.js');
const functions = require('./core/functions/jwt_lib.js');


const jwt_lib = include.jwt_lib;
const server = include.server;


server.start_server(3000);
server.set_router("/", (req, res)=>{
    res.send({msg : "Welcome abck"})
});

module.exports = {
    include
}