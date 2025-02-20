const Chat = require("../models/Chat");

const chatController = {
    // Obtener historial de chat
    obtenerMensajes: async (req, res) => {
        try {
            const mensajes = await Chat.find().sort({ fecha: 1 });
            res.json(mensajes);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al obtener mensajes", error: error.message });
        }
    },

    // Guardar nuevo mensaje en la base de datos
    guardarMensaje: async (req, res) => {
        try {
            const { usuario, mensaje } = req.body;
            const nuevoMensaje = new Chat({ usuario, mensaje });
            await nuevoMensaje.save();
            res.json({ mensaje: "Mensaje guardado correctamente" });
        } catch (error) {
            res.status(500).json({ mensaje: "Error al guardar mensaje", error: error.message });
        }
    }
};

module.exports = chatController;