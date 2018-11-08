const express = require('express');
const app = express();
const Product = require('../models/product');
const { verifyToken, verifyAdminRole } = require('../middlewares/auth');


// ===================================================
// Products CRUD
// ===================================================
// GET: Otener todos los productos
// ===================================================
app.get('/product', (req, res) => {

    Product.find({})
        .populate('category', 'description')
        .populate('user_create', 'name email')
        .populate('user_update', 'name email')
        .exec((err, allProducts) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'No se pudo realizar la peticion solicitada.',
                    err
                });
            }

            res.status(200).json({
                ok: true,
                product: allProducts
            });
        });
});

// ===================================================
// GET by ID: Obtener el producto por su ID
// ===================================================
app.get('/product/:id', (req, res) => {
    let id = req.params.id;

    Product.find(id)
        .populate('category', 'description')
        .populate('user_create', 'name email')
        .populate('user_update', 'name email')
        .exec((err, foundedProduct) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: `No se encontro el producto con el id: ${id}`,
                    err
                });
            }
            if (!foundedProduct) {
                return res.status(400).json({
                    ok: false,
                    message: `No se encontro el producto con el id: ${id}`,
                    err: {
                        msg: 'Producto no encotrado!'
                    }
                });
            }

            res.status(200).json({
                ok: true,
                product: foundedProduct
            });
        });
});

// ===================================================
// Buscar productos
// ===================================================
app.get('/products/search/:word', verifyToken, (req, res) => {
    let toSearch = new RegExp(req.params.word, 'i');
    Product.find({ name: toSearch }).populate('category', 'description')
        .exec((err, findedProduct) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: `No se encontro el producto con el nombre: ${toSearch}`,
                    err
                });
            }

            res.status(200).json({
                ok: true,
                results: findedProduct
            });
        })
});

// ===================================================
// POST: Crear un producto nuevo
// ===================================================
app.post('/product', verifyToken, (req, res) => {
    let body = req.body;

    let product = new Product({
        name: body.name,
        brand: body.brand,
        model: body.model,
        price: body.price,
        category: body.category,
        user_create: req.user._id
    });

    product.save((err, savedProduct) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'No se pudo guardar el producto.',
                err
            });
        }

        res.status(200).json({
            ok: true,
            product: savedProduct
        });
    });
});

// ===================================================
// PUT: Modificar el producto existente por su ID
// ===================================================
app.put('/product/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let modProduct = {
        name: body.name,
        brand: body.brand,
        model: body.model,
        price: body.price,
        category: body.category,
        user_update: req.user._id
    };

    Product.findByIdAndUpdate(id, modProduct, { new: true, runValidators: true }, (err, modifyProduct) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: `No se pudo actualizar el producto segun el id: ${id}`,
                err
            });
        }

        res.status(200).json({
            ok: true,
            product: modifyProduct
        });
    });

});

// ===================================================
// DELETE: Borrar un producto por su ID
// ===================================================
app.delete('/product/:id', (req, res) => {
    let id = req.params.id;

    Product.findByIdAndUpdate(id, { aviable: false }, { new: true, runValidators: true }, (err, removedProduct) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: `No se pudo remover el producto segun el id: ${id}`,
                err
            });
        }

        res.status(200).json({
            ok: true,
            product: removedProduct
        });
    });
});


module.exports = app;