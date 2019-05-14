sendResponseOK = function(res, statusCode, message, object) {
    return res.status(statusCode).json({
        ok: true,
        message: message,
        obj: object
    })
}


sendResponseNOTOK = function(res, statusCode, message, err, object) {
    return res.status(statusCode).json({
        ok: false,
        message: message,
        err: err,
        obj: object
    })
}


// ********************* //
module.exports = {
    sendResponseOK,
    sendResponseNOTOK
}