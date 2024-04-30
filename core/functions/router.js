const Eta = require('eta');
const path = require('path');
const appRoutes = require('core/App.js');

const isProduction = process.env['NODE_ENV'] === 'production';

const eta = new Eta.Eta({
    views: path.join(__dirname, '../../views'),
    cache: isProduction,
});

const appRouter = (app, db) => {

    app.get('/', (req, res) => {
        res.send(eta.render('index.html', { data: {} }));
    });

    appRoutes(app, db);

    return app;
};

module.exports = appRouter;