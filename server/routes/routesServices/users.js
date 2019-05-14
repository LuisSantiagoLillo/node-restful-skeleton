const User = require('../../models/user.js')
    // for sendOK - res, statusCode, message, object
    // for NOTOK - res, statusCode, message, err, object
const responseService = require('../routesResponse/responseService')

const bcrypt = require('bcrypt')
const _ = require('underscore');



getAllUsers = function(req, res) {

    let from = req.query.from || 0;
    from = Number(from);
    let limit = req.query.limit || 5;
    limit = Number(limit);

    User.find({ status: true }, 'name email role status google img')
        .skip(from)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                responseService.sendResponseNOTOK(res, 400, 'connection error with DataBase', err, null)
            }
            // Total of users with status true
            User.count({ status: true }, (err, total) => {
                let obj = {
                    users,
                    total
                }
                responseService.sendResponseOK(res, 200, 'allUsers', obj)
            });
        });
}

newUser = function(req, res) {
    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            responseService.sendResponseNOTOK(res, 400, 'connection error with DataBase', err, null)
        }
        responseService.sendResponseOK(res, 200, 'user founded', userDB)
    });
}

updateUser = function(req, res) {
    let id = req.params.id;
    // Returns the object filtered by the params I want
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: userDB
        });

    })
}

// JUST CHAGE THE STATUS TO FALSE NOT DELETE
deleteUserById = function(req, res) {
    let id = req.params.id;

    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    let changeStatus = {
        status: false
    };

    User.findByIdAndUpdate(id, changeStatus, { new: true }, (err, userDeleted) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!userDeleted) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            });
        }

        res.json({
            ok: true,
            usuario: userDeleted
        });

    });

}


// ********************* //
module.exports = {
    getAllUsers,
    newUser,
    updateUser,
    deleteUserById
}