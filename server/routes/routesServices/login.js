const User = require('../../models/user.js')

const bcrypt = require('bcrypt')
const _ = require('underscore');
const jwt = require('jsonwebtoken');


appLogin = function(req, res) {

    let body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {

        if (err) { // Internal server error
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDB) { // Not found
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(User) or password incorrect'
                }
            });
        }

        // Incorrect password
        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User or (password) incorrect'
                }
            });
        }

        // All is correct
        let token = jwt.sign({
            user: userDB
        }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

        res.json({
            ok: true,
            user: userDB,
            token
        });


    });

}

// ********************* //
module.exports = {
    appLogin
}