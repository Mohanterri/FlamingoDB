const include = require('./core/includes.js');


const jwt_lib = include.jwt_lib;
const server = include.server;


server.start_server(3000, (host, port) => {
    console.log(`Server it\'s started and listen, http://${host}:${port}`);
});


module.exports = {
    jwt_lib, server
}