const Eta = require('eta');
const path = require('path');
const appRoutes = require('core/App.js');
const observer = require('./observer.js');

const isProduction = process.env['NODE_ENV'] === 'production';

/*let adapter = new JSONFile("databases/db.json");
const db = new Low(new Observer(adapter), {});
db.read();
*/

const eta = new Eta.Eta({
    views: path.join(__dirname, '../../views'),
    cache: isProduction,
});

const appRouter = (app, fs) => {

    app.get('/', (req, res) => {
        res.send(eta.render('index.html', { data: {} }));
    });

    appRoutes("databases/db.json", app, fs);

};

module.exports = appRouter;