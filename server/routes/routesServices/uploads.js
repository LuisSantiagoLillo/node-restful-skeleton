const User = require('../../models/user.js')
const fs = require('fs')
const path = require('path')

// for sendOK - res, statusCode, message, object
// for NOTOK - res, statusCode, message, err, object
let responseService = require('../routesResponse/responseService')

const validExt = ['png', 'jpg', 'gif', 'jpeg']


uploadFiles = function(req, res) {
    let type = req.params.type
    let id = req.params.id

    // Check TYPES not valid
    let validTypes = ['products', 'users']
    if (validTypes.indexOf(type) < 0) {
        responseService.sendResponseNOTOK(res, 400, 'not valid type', null, validTypes)
    }

    // NO FILE UPLOADED
    if (!req.files) {
        responseService.sendResponseNOTOK(res, 400, 'file not found', null, null)
    }

    let sampleFile = req.files.file;
    let ext = sampleFile.name.split('.')[1]


    // Check EXT not valid
    if (validExt.indexOf(ext) < 0) {
        responseService.sendResponseNOTOK(res, 400, 'not valid extension', null, validExt)
    }

    // Change the name of the file
    // let nameFile = sampleFile.name.split('.')[0]
    let nameFile = `${id}-${new Date().getMilliseconds()}.${ext}`

    // Store the file
    sampleFile.mv(`uploads/${type}/${nameFile}`, err => {
        if (err) {
            responseService.sendResponseNOTOK(res, 500, 'path not found', err, null)
        }

        // File uploaded
        if (type == 'users') imageUser(id, res, nameFile)
    })
}


sendImage = function(req, res) {
    let type = req.params.type
    let nameFile = req.params.img
    let pathImg = path.resolve(__dirname, `../../../uploads/${type}/${nameFile}`)
    let pathNoImg = path.resolve(__dirname, '../../../assets/img/no_img.jpg')


    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg)
    } else {
        res.sendFile(pathNoImg)
    }
}



// ****** PRIVATE FUNCTIONS ****** //
function imageUser(id, res, nameFile) {
    User.findById(id, (err, userDB) => {
        // Issues with DB
        if (err) {
            deleteImg('users', nameFile)
            responseService.sendResponseNOTOK(res, 500, 'DataBase error', err, null)
        }
        // User ID don`t exist
        if (!userDB) {
            deleteImg('users', nameFile)
            responseService.sendResponseNOTOK(res, 400, 'User not found', null, null)
        }

        // User exist

        // Check the LAST IMG storage in the USER DB and DELETE
        deleteImg('users', userDB.img)

        // Store the new image in the DB
        userDB.img = nameFile

        userDB.save((err, userStorage) => {
            // Issues with DB
            if (err) {
                responseService.sendResponseNOTOK(res, 500, 'DataBase error', err, null)
            }
            // User not found
            if (!userStorage) {
                responseService.sendResponseNOTOK(res, 400, 'User not found', null, null)
            }
            responseService.sendResponseOK(res, 200, 'file uploaded', userStorage)
        })

    })
}



function deleteImg(type, nameImg) {
    // GET THE CORRECT PATH
    let pathImg = path.resolve(__dirname, `../../../uploads/${type}/${nameImg}`)
        // IF EXIST DELETE THE IMG
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg)
    }
}

// ********************* //
module.exports = {
    uploadFiles,
    sendImage
}