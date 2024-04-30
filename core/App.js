//database
var database;

function fetch(req, res, next){
    var responses = [];
    let checker = arr => arr.every(v => v === true);
    const document = res.locals.document;
    const table = res.locals.table;
    const query = res.locals.query;
    const datas = res.locals.data;

    if(document !== undefined){
        datas.forEach((item) =>{
            if(item.id === document){
                responses.push(item);
            }
        });
    }else{
        datas.forEach((item) =>{
            if(item.collection === table.replace('/', '')){
                var match_val = [];
                Object.keys(query).forEach((key) => {
                    match_val.push((item.data[key] !== undefined && query[key] === item.data[key]));
                });
                if(checker(match_val)){
                    responses.push(item);
                }
            }
        });
    }

    res.send(responses);
}

function getQueryRequest(req){
    return Object.fromEntries(Object.entries(req.query).map(([key, value]) => {
        if (['_start', '_end', '_limit', '_page', '_per_page'].includes(key) && typeof value === 'string') {
            return [key, parseInt(value)];
        }
        else {
            return [key, value];
        }
    }).filter(([_, value]) => !Number.isNaN(value)));
}

function readData(req, res, next){
    const params = req.params ?? '';
    const query = getQueryRequest(req);

    var parse = '';

    if(params.collection.startsWith('__') || params.collection.endsWith('__')){
        res.send({ statue : 33, msg : "Table not exist"});
        return;
    }

    parse = `/${params.collection}`;

    try{
        let q = database.getData('/__datas__');
        q.then((result) =>{
            res.locals.data = result;
            res.locals.table = parse;
            res.locals.query = query;
            next();
        }).catch((error) =>{
            res.send({ statue : 33, msg : error});
            return;
        });
    } catch(error) {
        res.send({ statue : 33, msg : error});
        return;
    };
}

function writeData(req, res, next){
    const params = req.params ?? '';
    const datas = req.body ?? '';
    const query = getQueryRequest(req);

    var parse = '';

    if(params.collection.startsWith('__') || params.collection.endsWith('__')){
        res.send({ statue : 33, msg : "Table not exist"});
        return;
    }

    parse = `${params.collection}`;

    var pushdata = {
        id : '',
        collection : `${parse}`,
        data : datas
    }

    if(params.document !== undefined){
       pushdata.id = params.document;
    }else{
        pushdata.id = require('./functions/random_id.js').makeid(15, []);
        database.push(`/__datas__[]`, pushdata).then((result) =>{
            console.log(result);
            next();
        }).catch((error) =>{
            res.send({ statue : 33, msg : error});
            return;
        })
    }
    next()
}

const appRoutes = (app, db) => {

    database = db;

    // READ
    app.get('/db/:collection', readData, (req, res, next) => {

       next();
    }, fetch);

    // READ DY DOC ID
    app.get('/db/:collection/:document', readData, (req, res, next) => {
        res.locals.document = req.params.document;

        next();
     }, fetch);

    // CREATE
    app.post('/db/:collection', writeData, (req, res, next) => {

        res.send({})
    });

    // CREATE
    app.post('/db/:collection/:document', writeData, (req, res, next) => {
        res.locals.document = req.params.document;

        res.send({})
    });

    // UPDATE
    app.put('/db/:collection/:document', readData, (req, res, next) => {

        next();
    }, fetch);

    // DELETE
    app.delete('/db/:collection/:document', readData, (req, res, next) => {

        next();
    }, fetch);
};

module.exports = appRoutes;