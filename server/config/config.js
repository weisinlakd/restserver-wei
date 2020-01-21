




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
let path;

if (process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
    path = '../../uploads';
}else {
    urlDB = process.env.MONGO_URI;
    // path = '../../../uploads';
    path = '../../uploads';
}

process.env.URLDB = urlDB;
process.env.RUTA_IMG = path;

//======================
//PARSEAR JWT
//======================

process.env.CADUCIDAD_TOKEN = '48h'; //60*60*24*30;

//======================
// tipos de foto
//======================

// process.env.TIPOS_FOTO = ['usuarios' , 'productos'];

//======================
// SEED de auth
//======================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


//======================
// CLIENT_ID GOOGLE
//======================

process.env.CLIENT_ID = process.env.CLIENT_ID || "586887553-aurf9stvin80vogpn95l3716e29jrbfj.apps.googleusercontent.com";




//======================
//PARSEAR JWT
//======================

// function parseJwt (token) {
//     var base64Url = token.split('.')[1];
//     var base64 = base64Url.replace('-', '+').replace('_', '/');
//     return JSON.parse(window.atob(base64));
// };