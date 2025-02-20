const mongoose = require("mongoose");

const carritoSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: false }, // Opcional para usuarios no autenticados
    productos: [
        {
            producto: { type: mongoose.Schema.Types.ObjectId, ref: "Producto", required: true },
            cantidad: { type: Number, required: true, default: 1 },
            precioUnitario: { type: Number, required: true }
        }
    ],
    total: { type: Number, required: true, default: 0 },
    estado: { type: String, enum: ["pendiente", "finalizado"], default: "pendiente" }
}, { timestamps: true });

module.exports = mongoose.model("Carrito", carritoSchema);
