const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const User = require('../models/usuario');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


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


// ===================================================
// Configuracion de Google Sign-In
// ===================================================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}

// ===================================================
// Google Autentificacion
// ===================================================

app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                message: 'Fallo la verificacion del token de google!',
                err
            });
        });

    User.findOne({ email: googleUser.email }, (err, findedUser) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                status: '500',
                message: `El usuario no existe!`,
                err
            });
        }

        if (findedUser) {
            if (findedUser.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe utilizar su autenticacion estandar'
                    }
                });
            } else {
                let token = jwt.sign({ user: findedUser }, process.env.SEED, { expiresIn: 14400 });

                res.status(200).json({
                    ok: true,
                    user: findedUser,
                    token
                });
            }
        } else {
            let user = new User({
                name: googleUser.name,
                email: googleUser.email,
                img: googleUser.img,
                google: true,
                password: ':P'
            });

            user.save((err, savedUser) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Error al guardar Usuario!',
                        err,
                    });
                }

                let token = jwt.sign({ user: savedUser }, process.env.SEED, { expiresIn: 14400 });

                res.status(200).json({
                    ok: true,
                    user: savedUser,
                    token,
                });
            });
        }

    });
});

module.exports = app;