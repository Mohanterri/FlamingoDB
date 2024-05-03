const makeid = (length, docs) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    if(docs.includes(result)){
        makeid(length, docs);
    }
    return result;
};

const getAllDoccumentId = (db) => {
    return db.getData('/__documents__');
};

module.exports = {getAllDoccumentId,  makeid}