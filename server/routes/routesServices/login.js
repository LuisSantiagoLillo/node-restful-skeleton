const User = require('../../models/user.js')

// for sendOK - res, statusCode, message, object
// for NOTOK - res, statusCode, message, err, object
const responseService = require('../routesResponse/responseService')

const bcrypt = require('bcrypt')
const _ = require('underscore');
const jwt = require('jsonwebtoken');


appLogin = function(req, res) {

    let body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {

        if (err) { // Internal server error
            responseService.sendResponseNOTOK(res, 500, 'Internal Server Error', err, null)
        }

        if (!userDB) { // Not found
            responseService.sendResponseNOTOK(res, 400, '(User) or password incorrect', null, null)
        }

        // Incorrect password
        if (!bcrypt.compareSync(body.password, userDB.password)) {
            responseService.sendResponseNOTOK(res, 400, 'User or (password) incorrect', null, null)
        }

        // All is correct
        let token = jwt.sign({
            user: userDB
        }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

        let obj = {
            user: userDB,
            token: token
        }

        responseService.sendResponseOK(res, 200, 'User founded', obj)

    });

}

// ********************* //
module.exports = {
    appLogin
}