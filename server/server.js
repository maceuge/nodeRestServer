require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Carga de todas las Rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log(`Base de Datos ONLINE`);
});

app.listen(process.env.PORT, () => {
    console.log(`El servidor inicio en el puerto: ${process.env.PORT}`);
});