const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    marca: { type: String },
    descripcion: { type: String },
    precio: { type: Number, required: true },
    categoria: { type: String, required: true },
    subcategoria: { type: String },
    imagenes: [
        {
            url: { type: String },
            public_id: { type: String }
        }
    ],
    stock: { type: Number, required: true, default: 0 },
    caracteristicas: [
        {
            nombre: { type: String },
            valor: { type: String }
        }
    ],
    activo: { type: Boolean, default: true },
    destacado: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Producto", productoSchema);
