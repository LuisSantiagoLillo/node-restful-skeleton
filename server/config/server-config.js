/**
 * NOTE: KEEP SAFE YOU INFORMATION
 * Production Environment: PROCESS.ENV wich sensible information are configurated in the SERVER (like HEROKU)
 * Development Environment: PROCESS.ENV are configurated in this config file
 */


// PORT SERVER
process.env.PORT = process.env.PORT || 3000;


// ENVIRONMENT
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// TOKEN
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.TOKEN_EXPIRATION = 60 * 60 * 24 * 30;


// SEED AUTHENTICATION
process.env.SEED = process.env.SEED || 'seed-for-dev-environment';


// URL DATA BASE
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;