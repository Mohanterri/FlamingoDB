require('rootpath')();
const path = require('path');

const { server } = require('./core/includes.js')
const { Server } = require("socket.io");
var p2pserver = require('socket.io-p2p-server').Server
const io = new Server(server);
io.use(p2pserver);

io.on('connection', (socket) => {
    socket.on('post', function(data) {
        
    });
});

module.exports = require('./core/includes.js');