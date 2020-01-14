




// ===================
// PUERTO
// ===================

process.env.PORT = process.env.PORT || 3000


// ===================
// ENTORNO
// ===================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ===================
// DB
// ===================

let urlDB;

if (process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//======================
//PARSEAR JWT
//======================

process.env.CADUCIDAD_TOKEN = 60*60*24*30;

//======================
// SEED de auth
//======================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


//======================
// CLIENT_ID GOOGLE
//======================

process.env.CLIENT_ID = process.env.CLIENT_ID || "586887553-c21u1eqc4dm22n1hs4jt4vebt0mv3ch4.apps.googleusercontent.com";




//======================
//PARSEAR JWT
//======================

// function parseJwt (token) {
//     var base64Url = token.split('.')[1];
//     var base64 = base64Url.replace('-', '+').replace('_', '/');
//     return JSON.parse(window.atob(base64));
// };