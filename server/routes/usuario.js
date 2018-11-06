const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const _under = require('underscore');

const User = require('../models/usuario');
const { verifyToken, verifyAdminRole } = require('../middlewares/auth');

app.get('/', function(req, res) {
    res.json('Hello World')
});


// ===================================================
// CRUD User Routes
// ===================================================

// Get USER
app.get('/user', verifyToken, (req, res) => {

    User.find({}, (err, allUser) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: `Se produjo un error en el servidor al intentar obtener todos los usuarios!`,
                err
            });
        }
        User.count({}, (err, count) => {
            res.status(201).json({
                ok: true,
                user: allUser,
                count: count
            });
        });
    });
});



// Create USER
app.post('/user', [verifyToken, verifyAdminRole], (req, res) => {
    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: `Error al realizar la peticion del guardado en la BD!`,
                err
            });
        }

        res.status(201).json({
            ok: true,
            user: userSaved
        });
    });
});

// Put USER
app.put('/user/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let body = _under.pick(req.body, ["name", "email", "img", "role", "state"]);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, updatedUser) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: `No se pudo actualizar al usuario con el id: ${id}`,
                err
            });
        }

        res.status(201).json({
            ok: true,
            user: updatedUser
        });
    });
});

// Delete USER
app.delete('/user/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id;

    User.findByIdAndRemove(id, (err, removedUser) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: `No existe el usuario con id: ${id}`,
                err
            });
        }

        res.status(200).json({
            ok: true,
            message: `Usuario: ${removedUser.name} fue borrado exitosamente!`,
            user: removedUser
        });
    });
});

module.exports = app;