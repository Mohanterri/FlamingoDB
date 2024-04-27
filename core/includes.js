const jwt_lib = require('./functions/jwt_lib.js');
const server = require('./functions/server.js');

module.exports = {
    jwt_lib : jwt_lib.app,
    server : server
}