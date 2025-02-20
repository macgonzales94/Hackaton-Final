const express = require("express");
const { crearProducto, obtenerProductos, obtenerProductoPorId, actualizarProducto, eliminarProducto } = require("../controllers/productoController");
const verificarToken = require("../middlewares/autenticacion");

const router = express.Router();

router.post("/", verificarToken, crearProducto); // Solo usuarios autenticados pueden crear productos
router.get("/", obtenerProductos);
router.get("/:id", obtenerProductoPorId);
router.put("/:id", verificarToken, actualizarProducto);
router.delete("/:id", verificarToken, eliminarProducto);

module.exports = router;
