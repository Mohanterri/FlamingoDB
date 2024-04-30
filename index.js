require('rootpath')();
const express = require('express');
const path = require('path');
const include = require('./core/includes.js');

var webserver;

const jwt_lib = include.jwt_lib;
const server = include.server;


server.start_server('localhost', 6661, async (serve, host, port) => {});

server.start_server('127.0.0.1', 80, async (serve, host, port) => {
    webserver = serve;
    webserver.use(express.static(path.join(__dirname, 'views')));
    console.log(`Server it\'s started and listen, http://${host}:${port}`);
});

module.exports = {
    jwt_lib,
    server
}