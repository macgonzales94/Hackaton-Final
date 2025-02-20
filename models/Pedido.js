const mongoose = require("mongoose");

const pedidoSchema = new mongoose.Schema({
    codigoPedido: { type: String, unique: true, required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    productos: [
        {
            producto: { type: mongoose.Schema.Types.ObjectId, ref: "Producto", required: true },
            cantidad: { type: Number, required: true },
            precioUnitario: { type: Number, required: true }
        }
    ],
    direccionEnvio: {
        calle: { type: String, required: true },
        ciudad: { type: String, required: true },
        distrito: { type: String, required: true },
        codigoPostal: { type: String, required: true },
        telefono: { type: String, required: true }
    },
    pago: {
        estado: { type: String, enum: ["pendiente", "pagado", "fallido"], default: "pendiente" },
        metodoPago: { type: String, required: true },
        referencia: { type: String },
        fecha: { type: Date, default: Date.now }
    },
    total: { type: Number, required: true },
    estado: { type: String, enum: ["pendiente", "procesando", "enviado", "entregado"], default: "pendiente" }
}, { timestamps: true });

module.exports = mongoose.model("Pedido", pedidoSchema);
