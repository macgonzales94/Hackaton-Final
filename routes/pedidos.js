const express = require("express");
const { crearPedido, obtenerPedidosUsuario, obtenerTodosLosPedidos, actualizarEstadoPedido, eliminarPedido } = require("../controllers/pedidoController");
const verificarToken = require("../middlewares/autenticacion");

const router = express.Router();

router.post("/crear", verificarToken, crearPedido);
router.get("/mis-pedidos", verificarToken, obtenerPedidosUsuario);
router.get("/", verificarToken, obtenerTodosLosPedidos);
router.put("/:id", verificarToken, actualizarEstadoPedido);
router.delete("/:id", verificarToken, eliminarPedido);

module.exports = router;
