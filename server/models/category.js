const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    description: { type: String, unique: true, required: [true, 'Descripcion requerida!'] },
    user_create: { type: Schema.Types.ObjectId, ref: 'User' },
    user_update: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Category', categorySchema);