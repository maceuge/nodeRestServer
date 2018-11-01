const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

// Establecer Roles Permitidos
let validRoles = {
    values: ['admin_role', 'user_role', 'super_role'],
    message: '{VALUE} no es un rol valido!'
};

const userSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es requerido!'] },
    email: { type: String, required: [true, 'El correo es requerido!'], unique: true },
    password: { type: String, required: [true, 'La contraseña es requerida!'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'user_role', enum: validRoles },
    state: { type: Boolean, default: true },
    google: { type: Boolean, default: false }
});

userSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico!' });

// Remover key: Password cuando el modelo User lo pase a JSON
userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
};

module.exports = mongoose.model('User', userSchema);