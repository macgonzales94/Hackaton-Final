const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// Ruta para obtener mensajes del chat
router.get("/", chatController.obtenerMensajes);

// Ruta para guardar un nuevo mensaje
router.post("/", chatController.guardarMensaje);

module.exports = router;