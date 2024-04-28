const dotenv = require('dotenv');

async function post_secure(req, res, next){
    //get client ip and compare to server ip
    //if match, continuous or not break sendStatus 401
    const clientip = req.ip;
    const remoteip = req.connection.localAddress
    
    console.log(clientip , remoteip);

    if(clientip !== remoteip) return res.sendStatus(403);
    
    next()

}


module.exports = {
    post_secure
}