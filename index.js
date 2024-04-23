const jwt_lib = require('./core/functions/jwt_lib.js');
const http = require('http');

http.createServer(jwt_lib.app).listen(jwt_lib.app.get('port'), function() {
    console.log("Express Server Runing on port"+ jwt_lib.app.get('port'));
});