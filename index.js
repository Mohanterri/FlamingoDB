const include = require('./core/includes.js');
var webserver;

const jwt_lib = include.jwt_lib;
const server = include.server;


webserver = server.start_server('127.0.0.1', 80, async (host, port) => {
    console.log(`Server it\'s started and listen, http://${host}:${port}`);
});

webserver.settings.env = 'production';

module.exports = {
    jwt_lib, server
}