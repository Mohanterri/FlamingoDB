const Eta = require('eta');
const path = require('path');
const appRoutes = require('../App.js');

const isProduction = process.env['NODE_ENV'] === 'production';

const eta = new Eta.Eta({
    views: path.join(__dirname, '../../views'),
    cache: isProduction,
});

const appRouter = (app, db) => {

    var collections = [];

    db.getData('/__collections__').then((val) =>{
        val.forEach(element => {
            collections.push(element.name);
        });
    });

    app.get('/', (req, res) => {
        res.send(eta.render('index.html', { data: collections }));
    });

    appRoutes(app, db);

    return app;
};

module.exports = appRouter;