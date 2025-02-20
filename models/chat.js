const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
    usuario: { type: String, required: true },
    mensaje: { type: String, required: true },
    fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Chat", ChatSchema);