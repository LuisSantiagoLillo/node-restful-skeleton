// for sendOK - res, statusCode, message, object
// for NOTOK - res, statusCode, message, err, object
let responseService = require('../routesResponse/responseService')


serverStatus = function(req, res) {
    let message = 'Server Online on port ' + process.env.PORT
    responseService.sendResponseOK(res, 200, message, null)
}

serverConfig = function(req, res) {
    let message = 'Server Online on port ' + process.env.PORT + '/n DataBase connection OK on ' + process.env.URLDB
    responseService.sendResponseOK(res, 200, message, null)
}


// ********************* //
module.exports = {
    serverStatus,
    serverConfig
}