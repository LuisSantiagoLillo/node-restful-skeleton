const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a valid role'
};


let Schema = mongoose.Schema;


let usuarioSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name required']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email required']
    },
    password: {
        type: String,
        required: [true, 'Password required']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

// DELETE THE PASSWORD FROM THE USER RESPONSE
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

// UNIQUE VALIDATOR MESSAGE
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} must be unic' });


module.exports = mongoose.model('User', usuarioSchema);