const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
    const token = req.header("Authorization");

    // Verificar si se envió un token
    if (!token) {
        return res.status(401).json({ mensaje: "Acceso denegado. No hay token." });
    }

    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRETO);
        req.usuario = decoded; // Guardar los datos del usuario en la petición
        next();
    } catch (error) {
        res.status(401).json({ mensaje: "Token inválido o expirado." });
    }
};

module.exports = verificarToken;
