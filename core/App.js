const makeId = require('./functions/random_id.js');
//database
var database;

function deleteItem(id, res, next){
    database.getIndex("/__datas__", id , "id").then(index =>{
        if(index === -1){
            res.send({ statue : 34, msg : "Document not exist"});
            return;
        }
        makeId.getAllDoccumentId(database).then((val) => {
            database.delete(`/__datas__[${index}]`).then((resu) =>{
                database.delete(`/__documents__[${val.indexOf(id)}]`);
                res.locals.result = {id : id};
                next();
            }).catch((err) =>{
                deleteItem(id, res, next);
            });
        }).catch((error) =>{
            res.send({ statue : 34, msg : error});
            return;
        });
    }).catch(err =>{
        res.send({ statue : 34, msg : err});
        return;
    });
}

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
        //update
        pushdata.id = params.document;
        database.getIndex("/__datas__", pushdata.id , "id").then(re =>{
            database.getData(`/__datas__[${re}]/data`).then(v =>{
                Object.keys(datas).forEach((val) => {
                    database.push(`/__datas__[${re}]/data/${val}`, datas[val]);
                });
            });
            res.locals.result = {id : pushdata.id};
            next();
        });
    }else{
        //add
        makeId.getAllDoccumentId(database).then((val) => {
            pushdata.id = makeId.makeid(15, val);
        }).catch((error) =>{
            console.log(error);
        });
        
        database.push(`/__datas__[]`, pushdata).then(() =>{
            database.push(`/__documents__[]`, pushdata.id);
            database.getIndex("/__collections__", pushdata.collection, "name").then((re) =>{
                if(re === -1){
                    database.push(`/__collections__[]`, {id_project : "", name : pushdata.collection});
                }
                res.locals.result = pushdata;
                next();
            })
        }).catch((error) =>{
            res.send({ statue : 33, msg : error});
            return;
        })
    }
}

function deleteData(req, res, next){
    let checker = arr => arr.every(v => v === true);
    const query = getQueryRequest(req);
    const params = req.params ?? '';
    const body = req.body ?? '';
    const datas = res.locals.data;
    const id = params.document;
    const document = res.locals.document;
    const table = res.locals.table;

    if(params.document === undefined){
        datas.forEach((item) =>{
            if(item.collection === table.replace('/', '')){
                var match_val = [];
                Object.keys(query).forEach((key) => {
                    match_val.push((item.data[key] !== undefined && query[key] === item.data[key]));
                });
                if(checker(match_val)){
                    deleteItem(item.id, res, next)
                }
            }
        });
        res.locals.result = {msg : "Deleting successfully"}
        next();
    }else{
        deleteItem(id, res, next);
        res.locals.result = {msg : "Deleting successfully"}
        next();
    }
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
        var data = res.locals.result;
        res.send(data);
    });

    // UPDATE SINGLE DOCUMENT
    app.put('/db/:collection/:document', writeData, (req, res, next) => {
        var data = res.locals.result;
        res.send(data)
    });

    // DELETE
    app.delete('/db/:collection/', readData, deleteData, (req, res, next) => {
        var result = res.locals.result;
        res.send(result)
    });

    // DELETE BY ID
    app.delete('/db/:collection/:document', deleteData, (req, res, next) => {
        var result = res.locals.result;
        res.send(result)
    });
};

module.exports = appRoutes;