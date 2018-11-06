const express = require('express');
const app = express();

// Cargar Rutas
app.use(require('./usuario'));
app.use(require('./login'));

module.exports = app;