const jwt = require('jsonwebtoken');


// ===================================================
// Verificar el token
// ===================================================
let verifyToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, tokenDecode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'Token incorrecto!',
                err
            });
        }
        req.user = tokenDecode.user;
        next();
    });
};

// ===================================================
// Verificar el role
// ===================================================
let verifyAdminRole = (req, res, next) => {
    let user = req.user;

    if (user.role !== 'admin_role') {
        return res.status(400).json({
            ok: false,
            message: 'No tiene permisos de administrador para realizar este proceso!',
            err: { msg: 'Se requieren permisos del administrador!' }
        });
    }
    next();
};

module.exports = {
    verifyToken,
    verifyAdminRole
};