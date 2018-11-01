require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Cargar Ruta de Usuarios
app.use(require('./routes/usuario'));

mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log(`Base de Datos ONLINE`);
});

app.listen(process.env.PORT, () => {
    console.log(`El servidor inicio en el puerto: ${process.env.PORT}`);
});