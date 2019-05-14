var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();
// app.use(fileUpload()); // default options - middleware of file express fileupload library
app.use(fileUpload({ useTempFiles: true })); // New configuration for fileUpload

// Import Middlewares
var { verifyAdmin_Role, verifyToken, verifyTokenImg } = require('../middlewares/jwt-authentication')

// Import Functions for RoutesServices
var serverConfig = require('./routesServices/server-config')
var usersService = require('./routesServices/users')
var loginService = require('./routesServices/login')
var uploadsService = require('./routesServices/uploads')

// ALL ROUTES **************************************************************
// app.method('/path', [middleware, middleware, ...], funtionServiceImported)
// BASIC ROUTE

// LOGIN ROUTES
app.post('/login', loginService.appLogin)

// SERVER CONFIG ROUTES
app.get('/server-status', [verifyToken, verifyAdmin_Role], serverConfig.serverStatus)
app.get('/server-config', [verifyToken, verifyAdmin_Role], serverConfig.serverConfig)


// USERS ROUTES
app.get('/getAllUsers', [verifyToken], usersService.getAllUsers)
app.post('/newUser', usersService.newUser)
app.put('/updateUserById/:id', [verifyToken], usersService.updateUser)
app.delete('/deleteUserById/:id', [verifyToken], usersService.deleteUserById)


// UPLOAD ROUTES
app.put('/upload/:type/:id', [verifyToken], uploadsService.uploadFiles)
app.get('/image/:type/:img', [verifyTokenImg], uploadsService.sendImage)


//**************************************************************************


module.exports = app;