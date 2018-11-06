const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const User = require('../models/usuario');
const jwt = require('jsonwebtoken');


// ===================================================
// Autenticacion Estandar
// ===================================================
app.post('/login', (req, res) => {
    let body = req.body;

    User.findOne({ email: body.email }, (err, findedUser) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                status: '500',
                message: `El usuario no existe!`,
                err
            });
        }

        if (!findedUser) {
            return res.status(400).json({
                ok: false,
                status: '400',
                message: `El email: ${body.email} no pertenece a un usuario registrado`,
                err: { msg: 'Correo: Credinciales incorrectas!' }
            });
        }

        if (!bcrypt.compareSync(body.password, findedUser.password)) {
            return res.status(400).json({
                ok: false,
                status: '400',
                message: `La contraseña no es correcta o fue mal ingresada!`,
                err: { msg: 'Contraseña: Credinciales incorrectas!' }
            });
        }

        let token = jwt.sign({ user: findedUser }, process.env.SEED, { expiresIn: 14400 }); // 4hs

        res.status(200).json({
            ok: true,
            status: '200',
            user: findedUser,
            token
        });
    });

});

module.exports = app;