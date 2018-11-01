// ===================================================
// Puerto para Heroku
// ===================================================
process.env.PORT = process.env.PORT || 3000;

// ===================================================
// Puerto para DB
// ===================================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDb;

if (process.env.NODE_ENV === 'dev') {
    urlDb = 'mongodb://localhost:27017/admin';
} else {
    urlDb = process.env.MONGO_URI;
}

process.env.URLDB = urlDb;