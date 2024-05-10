require('rootpath')();
const { exec } = require('child_process');
const express = require('express');
const path = require('path');
const include = require('./core/includes.js');

var webserver;

const jwt_lib = include.jwt_lib;
const server = include.server;


server.start_server('localhost', 443, async (serve, host, port) => {
    webserver = serve;
    webserver.use(express.static(path.join(__dirname, 'views')));
    console.log(`Server it\'s started and listen, https://${host}:${port}`);
});

exec('curl ip-adresim.app', function(error, stdout, stderr){
    if(error){
        console.log("public server not started");
        return;
    }
    server.start_server(`${stdout}`, 6661, async (serve, host, port) => {
        console.log(`Server it\'s started and listen, https://${host}:${port}`);
    });
})


module.exports = {
    jwt_lib,
    server
}