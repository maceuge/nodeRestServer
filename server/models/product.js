const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, required: [true, 'Nombre del producto es requerido!'] },
    brand: { type: String, required: [true, 'Marca del producto es requerida!'] },
    model: { type: String, required: [true, 'Modelo del producto es requerido!'] },
    description: { type: String, required: false },
    price: { type: Number, required: [true, 'El precio unitario es requerido!'] },
    aviable: { type: Boolean, required: true, default: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    user_create: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    user_update: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Product', productSchema);