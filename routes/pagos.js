const express = require("express");
const { obtenerConfig, generarToken, procesarPago } = require("../controllers/pagoController");

const router = express.Router();

router.get("/config", obtenerConfig); // Para obtener la clave pública
router.post("/generar-token", generarToken); // Para generar un token con Culqi
router.post("/procesar", procesarPago); // Para procesar el pago


module.exports = router;
