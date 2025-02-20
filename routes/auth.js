const express = require("express");
const { registrarUsuario, iniciarSesion } = require("../controllers/authController");
const verificarToken = require("../middlewares/autenticacion");

const router = express.Router();

router.post("/registro", registrarUsuario);
router.post("/login", iniciarSesion);

// Ruta protegida: Solo accesible si el usuario tiene un token válido
router.get("/perfil", verificarToken, (req, res) => {
    res.json({ mensaje: "Acceso permitido", usuario: req.usuario });
});

module.exports = router;
