const express = require('express');
const app = express();
let { verifyToken, verifyAdminRole } = require('../middlewares/auth');
let Category = require('../models/category');


// ===================================================
// CATEGORY CRUD API
// ===================================================
// GET: Obtener todas las categorias
// ===================================================
app.get('/category', verifyToken, (req, res) => {
    Category.find({})
        .sort('description')
        .populate('user_create', 'name email')
        .populate('user_update', 'name email')
        .exec((err, findedCategory) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'No se encontraron categorias',
                    err,
                });
            }

            res.status(200).json({
                ok: true,
                category: findedCategory
            });
        });
});

// ===================================================
// GET: Obtener Categoria por ID
// ===================================================
app.get('/category/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    Category.findById(id)
        .populate('user_create', 'name email')
        .populate('user_update', 'name email')
        .exec((err, findedCategory) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: `No se encontro la categoria con el id: ${id}`,
                    err,
                });
            }

            res.status(200).json({
                ok: true,
                category: findedCategory
            });
        });
});

// ===================================================
// POST: Crear nueva Categoria
// ===================================================
app.post('/category', verifyToken, (req, res) => {
    let body = req.body;

    let category = new Category({
        description: body.description,
        user_create: req.user._id
    });

    category.save((err, savedCategory) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'No se pudo guardar la categoria!',
                err,
            });
        }
        res.status(200).json({
            ok: true,
            category: savedCategory
        });
    });

});

// ===================================================
// PUT: Modificar la Categoria Existente
// ===================================================
app.put('/category/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let newCategory = {
        description: body.description,
        user_update: req.user._id
    };

    Category.findByIdAndUpdate(id, newCategory, { new: true, runValidators: true }, (err, updatedCategory) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'No se pudo actualizar la categoria!',
                err,
            });
        }

        res.status(201).json({
            ok: true,
            category: updatedCategory
        });
    });
});

// ===================================================
// DELETE: Borrar Categoria por ID
// ===================================================
app.delete('/category/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, deletedCategory) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'No se pudo eliminar la categoria!',
                err,
            });
        }

        res.status(200).json({
            ok: true,
            category: deletedCategory
        });
    });
});


module.exports = app;