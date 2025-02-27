const Eta = require('eta');
const path = require('path');
const express = require('express');
const fs = require('fs');
const secures = require('../functions/secures.js');
const appRoutes = require('../App.js');
const jwt_lib = require('./jwt_lib.js');

const isProduction = process.env['NODE_ENV'] === 'production';

const eta = new Eta.Eta({
    views: path.join('./views'),
    cache: isProduction,
});

async function count_items(db, element){
    var count = 0;
    return new Promise((resolve) =>{
        db.getData('/__datas__').then((data) =>{
            data.forEach((item) =>{
                if(item.collection === element){
                    count += 1;
                };
            });
            resolve(count);
        });
    });
}


const appRouter = (app, db) => {

    var collections = [];

    db.getData('/__collections__').then((val) =>{
        val.forEach(element => {
            var count = 0;

            count_items(db, element.name).then((result) => {
                count = result;
                collections.push({
                    name : element.name,
                    count : count
                });
            });
        });
    }).catch((err) => {
        db.push('/__projects__', []);
        db.push('/__collections__', []);
        db.push('/__documents__', []);
        db.push('/__datas__', []);
    });

    app.get('/', (req, res) => {
        res.send(eta.render('index.html', { data: collections }));
    });

    appRoutes(app, db);

    return app;
};

module.exports = appRouter;