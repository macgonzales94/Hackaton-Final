const chat = require("../models/chat");

const chatController = {
    // Obtener historial de chat
    obtenerMensajes: async (req, res) => {
        try {
            const mensajes = await chat.find().sort({ fecha: 1 });
            res.json(mensajes);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al obtener mensajes", error: error.message });
        }
    },

    // Guardar nuevo mensaje en la base de datos
    guardarMensaje: async (req, res) => {
        try {
            const { usuario, mensaje } = req.body;
            const nuevoMensaje = new chat({ usuario, mensaje });
            await nuevoMensaje.save();
            res.json({ mensaje: "Mensaje guardado correctamente" });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al guardar mensaje", error: error.message });
        }
    }
};

module.exports = chatController;