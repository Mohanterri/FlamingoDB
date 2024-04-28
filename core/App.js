
const { isItem, Service } = require('core/services.js');

const appRoutes = (dataPath, app, fs) => {

    // helper methods
    const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                throw err;
            }
            callback(returnJson ? JSON.parse(data) : data);
        });
    };

    const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {
        fs.writeFile(filePath, fileData, encoding, (err) => {
            if (err) {
                throw err;
            }
            callback();
        });
    };

    // READ
    app.get('/:name', (req, res, next) => {
        const name = req.params ?? '';
        const query = Object.fromEntries(Object.entries(req.query).map(([key, value]) => {
            if (['_start', '_end', '_limit', '_page', '_per_page'].includes(key) && typeof value === 'string') {
                return [key, parseInt(value)];
            }
            else {
                return [key, value];
            }
        }).filter(([_, value]) => !Number.isNaN(value)));

        //console.log(name, query);
        //res.locals['data'] = Service.find(name, query);

        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }
            res.send(JSON.parse(data));
        });
    });

    // CREATE
    app.post('/:name', (req, res) => {
        readFile(data => {
            const newUserId = Date.now().toString();
            data[newUserId.toString()] = req.body;

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send('new user added');
            });
        }, true);
    });


    // UPDATE
    app.put('/:name/:id', (req, res) => {
        readFile(data => {
            const userId = req.params["id"];
            data[userId] = req.body;
            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`users id:${userId} updated`);
            });
        }, true);
    });


    // DELETE
    app.delete('/:name/:id', (req, res) => {

        readFile(data => {
            const userId = req.params["id"];
            delete data[userId];

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`users id:${userId} removed`);
            });
        }, true);
    });
};

module.exports = appRoutes;