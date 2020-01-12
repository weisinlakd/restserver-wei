




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
    urlDB = 'mongodb+srv://weisin:I78yKzMTiqPmwHgX@cluster0-woq9x.gcp.mongodb.net/cafe?retryWrites=true&w=majority';
}

process.env.URLDB = urlDB;


