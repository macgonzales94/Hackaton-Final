const express = require("express");
const { agregarAlCarrito, obtenerCarrito, eliminarProductoDelCarrito, vaciarCarrito, sincronizarCarrito } = require("../controllers/carritoController");
const verificarToken = require("../middlewares/autenticacion");

const router = express.Router();

router.post("/sincronizar", verificarToken, sincronizarCarrito);
router.post("/agregar", verificarToken, agregarAlCarrito);
router.get("/", verificarToken, obtenerCarrito);
router.delete("/eliminar/:productoId", verificarToken, eliminarProductoDelCarrito);
router.delete("/vaciar", verificarToken, vaciarCarrito);

module.exports = router;
